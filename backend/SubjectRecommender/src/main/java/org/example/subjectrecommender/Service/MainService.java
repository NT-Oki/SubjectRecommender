package org.example.subjectrecommender.Service;

import ca.pfv.spmf.algorithms.frequentpatterns.efim.AlgoEFIM;
import org.example.subjectrecommender.Model.*;
import org.example.subjectrecommender.Repository.*;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MainService {
    ScoreRepository scoreRepository;
    SubjectRepository subjectRepository;
    HUItemsetRepository HUItemsetRepository;
    PrerequisiteRepository prerequisiteRepository;
    CurriculumCourseRepository curriculumCourseRepository;
    public MainService(ScoreRepository scoreRepository, SubjectRepository subjectRepository, HUItemsetRepository HUItemsetRepository,
     PrerequisiteRepository prerequisiteRepository, CurriculumCourseRepository curriculumCourseRepository) {
        this.scoreRepository = scoreRepository;
        this.subjectRepository = subjectRepository;
        this.HUItemsetRepository = HUItemsetRepository;
        this.prerequisiteRepository = prerequisiteRepository;
        this.curriculumCourseRepository = curriculumCourseRepository;
    }
    //1
    public void exportTransactionFile(String outputPath) throws IOException {
        List<Score> scores = scoreRepository.findAll();

        Map<String, List<Score>> groupedByUser = scores.stream()
                .collect(Collectors.groupingBy(score -> score.getUser().getId()));
        int total=0;
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
            for (Map.Entry<String, List<Score>> entry : groupedByUser.entrySet()) {
                List<Score> userScores = entry.getValue();

                List<String> items = userScores.stream()
                        .map(score -> String.valueOf(score.getSubject().getId()))
                        .collect(Collectors.toList());

                List<String> utilities = userScores.stream()
                        .map(score -> String.valueOf(Math.round(score.getUtility())))
                        .collect(Collectors.toList());

                // Sử dụng double để chính xác, ép về float hoặc int nếu cần
                int transactionUtility = userScores.stream()
                        .mapToInt(score -> Math.round(score.getUtility()))
                        .sum();
                total+=transactionUtility;
                String line = String.join(" ", items) + ":" + (int)transactionUtility + ":" + String.join(" ", utilities);

                writer.write(line);
                writer.newLine();
            }
        }
        System.out.println("Total Utility: " + total);
    }
    //2
    public void runEFIM(String inputPath, String outputPath, int minUtil) throws IOException {
        boolean keepTransactions = false;// Có giữ giao dịch trong bộ nhớ hay không
        int maxMemory = 50000; // Giới hạn bộ nhớ (tùy chỉnh)
        boolean printVerbose = true;// In thông tin quá trình mining hay không

        AlgoEFIM algo = new AlgoEFIM();
        algo.runAlgorithm(minUtil, inputPath, outputPath, keepTransactions, maxMemory, printVerbose);
        algo.printStats();
    }
    //3
        public List<HUItemset> readAndSaveItemsets(String efimResultFile) throws IOException {
            HUItemsetRepository.deleteAll();
            List<HUItemset> itemsets = new ArrayList<>();
            List<String> lines = Files.readAllLines(Paths.get(efimResultFile));

            for (String line : lines) {
                String[] parts = line.split(" #UTIL:");
                if (parts.length != 2) continue;

                List<String> items = Arrays.stream(parts[0].trim().split(" "))
                        .map(String::trim)
                        .collect(Collectors.toList());

                float utility = Float.parseFloat(parts[1].trim());

                HUItemset itemset = new HUItemset();
                itemset.setItems(items);
                itemset.setUtility(utility);
                itemsets.add(itemset);
            }

            HUItemsetRepository.saveAll(itemsets);

            return itemsets;
        }



    /**
     * xét subject đưa vào có đủ điều kiện để được gợi ý không
     * 1.
     * @param user
     * @param subject
     * @return
     */
    public boolean isEligible(User user, Subject subject, int semester, Set<String> passedSubjectIds) {
    //     Kiểm tra các môn tiên quyết (nếu có) của subject đã pass chưa
        List<Prerequisite> prerequisites =prerequisiteRepository.findBySubject(subject);
        for (Prerequisite prerequisite : prerequisites) {
            Subject preSubject=prerequisite.getPrerequisiteSubject();
            if (!passedSubjectIds.contains(preSubject.getId())) {
                return false; // Chưa học hoặc chưa qua môn tiên quyết
            }
        }

        // kiểm tra subject có được mở trong kỳ hiện tại không
        List<CurriculumCourse> curriculumCourseList=curriculumCourseRepository.findCurriculumCourseBySemester(semester);
        Set<String> subjectIdsInCurriculum = curriculumCourseList.stream()
                .map(cc -> cc.getSubject().getId())
                .collect(Collectors.toSet());
        if(!subjectIdsInCurriculum.contains(subject.getId())) {
            return false;
        }

        return true;
    }
//4
public List<Subject> suggestSubjectsForUser(User user, int semester) {
    // Môn đã học và pass rồi
    Set<String> learnedSubjectIds = scoreRepository.findByUserAndPassed(user,1)
            .stream()
            .map(score -> score.getSubject().getId())
            .collect(Collectors.toSet());

    // Lấy toàn bộ HUItemsets và sắp xếp theo utility giảm dần
    List<HUItemset> huItemsets = HUItemsetRepository.findAll();
    huItemsets.sort((a, b) -> Float.compare(b.getUtility(), a.getUtility())); // sắp xếp giảm dần

    // Tránh gợi ý trùng
    Set<Subject> suggestions = new LinkedHashSet<>();

    // Duyệt từng itemset theo utility giảm dần
    for (HUItemset huItemset : huItemsets) {
        List<String> itemIds = huItemset.getItems();
        // Nếu sinh viên đã học ít nhất 1 môn trong itemset → xét gợi ý
        boolean hasLearnedOne = itemIds.stream().anyMatch(learnedSubjectIds::contains);
        if (!hasLearnedOne) continue;
        long countLearned= itemIds.stream().filter(learnedSubjectIds::contains).count();
        double coverage= Math.round((double)countLearned/itemIds.size()*10)/10.0;
        System.out.println(coverage);
        if (coverage<0.5) continue;
        for (String subjectId : huItemset.getItems()) {
            //nếu nó chưa học hoặc chưa pass
            if (!learnedSubjectIds.contains(subjectId)) {
                Subject subject = subjectRepository.findById(subjectId).orElse(null);
                if (subject != null && isEligible(user, subject,semester, learnedSubjectIds)) {
                    suggestions.add(subject);
                }
            }
        }
    }

    return new ArrayList<>(suggestions);
}

}
