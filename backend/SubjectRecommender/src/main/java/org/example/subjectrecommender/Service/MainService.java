package org.example.subjectrecommender.Service;

import ca.pfv.spmf.algorithms.frequentpatterns.efim.AlgoEFIM;
import org.example.subjectrecommender.Model.*;
import org.example.subjectrecommender.Repository.*;
import org.example.subjectrecommender.dto.SubjectGroupRequirementDTO;
import org.example.subjectrecommender.dto.SubjectRecommendDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
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
    @Autowired
    ScoreRepository scoreRepository;
    @Autowired
    SubjectRepository subjectRepository;
    @Autowired
    HUItemsetRepository HUItemsetRepository;
    @Autowired
    PrerequisiteRepository prerequisiteRepository;
    @Autowired
    CurriculumCourseRepository curriculumCourseRepository;
    @Autowired
    PrerequisiteService prerequisiteService;
    @Autowired
    SubjectGroupRequirementService subjectGroupRequirementService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SubjectGroupService subjectGroupService;

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
     * @param subject
     * @return
     */
    public boolean isEligible(Subject subject, int semester, Set<String> passedSubjectIds) {
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
public Page<SubjectRecommendDTO> suggestSubjectsForUser(String userId, int semester, Pageable pageable) {
    // Môn đã học và pass rồi
    Set<String> learnedSubjectIds = scoreRepository.findByUserIdAndPassed(userId, 1)
            .stream()
            .map(score -> score.getSubject().getId())
            .collect(Collectors.toSet());
    // Lấy toàn bộ HUItemsets và sắp xếp theo utility giảm dần
    List<HUItemset> huItemsets = HUItemsetRepository.findAll();
    huItemsets.sort((a, b) -> Float.compare(b.getUtility(), a.getUtility())); // utility giảm dần
    // Tránh gợi ý trùng
    Set<SubjectRecommendDTO> suggestions = new LinkedHashSet<>();
    // Duyệt từng itemset theo utility giảm dần
    for (HUItemset huItemset : huItemsets) {
        List<String> itemIds = huItemset.getItems();
        // Nếu sinh viên đã học ít nhất 1 môn trong itemset → xét gợi ý
        boolean hasLearnedOne = itemIds.stream().anyMatch(learnedSubjectIds::contains);
        if (!hasLearnedOne) continue;
        long countLearned= itemIds.stream().filter(learnedSubjectIds::contains).count();
        double coverage= Math.round((double)countLearned/itemIds.size()*10)/10.0;
        System.out.println(coverage);
//        if (coverage<0.5) continue;
        for (String subjectId : itemIds) {

            if (!learnedSubjectIds.contains(subjectId)) {  //nếu nó chưa học hoặc chưa pass
                Subject subject = subjectRepository.findById(subjectId).orElse(null);
                if (subject != null && isEligible(subject, semester, learnedSubjectIds)) {
                    List<Subject> preSubjects = prerequisiteService.getAllPrerequisiteSubjectsBySubjectId(subject.getId());
                    SubjectRecommendDTO dto = new SubjectRecommendDTO();
                    dto.setSubject(subject);
                    dto.setUtility(huItemset.getUtility());
                    dto.setPreSubjects(preSubjects);
                    suggestions.add(dto);
                }
            }
        }
    }

    // Áp dụng phân trang thủ công
    List<SubjectRecommendDTO> allSuggestions = new ArrayList<>(suggestions);
    int total = allSuggestions.size();
    int start = (int) pageable.getOffset();
    int end = Math.min((start + pageable.getPageSize()), total);
    List<SubjectRecommendDTO> pageContent = (start < end) ? allSuggestions.subList(start, end) : Collections.emptyList();

    return new PageImpl<>(pageContent, pageable, total);
}

    /**
     * Lấy ra danh sách DTO( nhóm môn học, số tín chỉ yêu cầu, số tín chỉ đã học
     */
    public List<SubjectGroupRequirementDTO> getAllSubjectGroupRequirments(String userId) {
        List<Score> scoreList= scoreRepository.findByUserIdAndPassed(userId,1);
        User user=userRepository.getReferenceById(userId);
        List<String> learnedSubjectIds=new ArrayList<>();
        for(Score score: scoreList){
            learnedSubjectIds.add(score.getSubject().getId());
        }
        List<SubjectGroupRequirement> subjectGroupRequirementList=subjectGroupRequirementService.getAllByCurriculumVersion(user.getCurriculumVersion().getId());
        List<SubjectGroupRequirementDTO> subjectGroupRequirementDTOList=new ArrayList<>();
        for(SubjectGroupRequirement subjectGroupRequirement : subjectGroupRequirementList) {
            SubjectGroupRequirementDTO subjectGroupRequirementDTO=new SubjectGroupRequirementDTO();
            subjectGroupRequirementDTO.setSubjectGroup(subjectGroupRequirement.getSubjectGroup());
            subjectGroupRequirementDTO.setRequirementCredit(subjectGroupRequirement.getRequiredCredit());
            int learnedCredit=0;
            for(String subjectId: learnedSubjectIds) {
                Subject subject=subjectRepository.getReferenceById(subjectId);
                if(subject.getSubjectGroup().equals(subjectGroupRequirement.getSubjectGroup())) {
                    learnedCredit+=subject.getCredit();
                }
            }
            subjectGroupRequirementDTO.setLearnedCredit(learnedCredit);
            subjectGroupRequirementDTOList.add(subjectGroupRequirementDTO);
        }
        System.out.println(subjectGroupRequirementDTOList);
        return subjectGroupRequirementDTOList;
    }


}
