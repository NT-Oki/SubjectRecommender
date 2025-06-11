package org.example.subjectrecommender.Service;
import ca.pfv.spmf.algorithms.sequential_rules.husrm.AlgoHUSRM;
import org.example.subjectrecommender.Model.*;
import org.example.subjectrecommender.Repository.*;
import org.example.subjectrecommender.config.ValueProperties;
import org.example.subjectrecommender.dto.SubjectGroupRequirementDTO;
import org.example.subjectrecommender.dto.SubjectRecommendDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.*;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.function.Function;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
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
    @Autowired
    ValueProperties valueProperties;
    @Autowired
    RuleRepository ruleRepository;
    @Autowired
    RuleActiveRepository ruleActiveRepository;

    //1 1sv1 transaction
//    public void exportTransactionFile() throws IOException {
//        String outputPath= valueProperties.getFileExportTransaction();
//        boolean filterPassedSubjects = valueProperties.isFilterPassedSubjects();
//        List<Score> scores = scoreRepository.findAll();
//        Map<String, List<Score>> groupedByUser = scores.stream()
//                .collect(Collectors.groupingBy(score -> score.getUser().getId()));
//        int total=0;
//        int totalLine=0;
//        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
//            for (Map.Entry<String, List<Score>> entry : groupedByUser.entrySet()) {
//                List<Score> userScores = entry.getValue();
//                userScores.sort(Comparator
//                        .comparing(Score::getYear)
//                        .thenComparing(Score::getSemester));
//                List<String> itemIDs = new ArrayList<>();
//                List<String> itemUtilities = new ArrayList<>();
//                long transactionUtilitySum = 0;
//                for (Score score : userScores) {
//                    if (filterPassedSubjects && score.getPassed() != 1) {
//                        continue; // Bỏ qua nếu đang lọc và môn này chưa pass
//                    }
//
//                    itemIDs.add(String.valueOf(score.getSubject().getId())+"["+Math.round(score.getUtility())+"]");
//                    long roundedUtility = Math.round(score.getUtility());
//                    itemUtilities.add(String.valueOf(roundedUtility));
//                    transactionUtilitySum += roundedUtility;
//                }
//                if (itemIDs.isEmpty()) {
//                    continue;
//                }
//                String sequenceLine = String.join(" -1 ", itemIDs) + " -1 -2 S:" + transactionUtilitySum;
//                writer.write(sequenceLine);
//                writer.newLine();
//                total += transactionUtilitySum;
//                totalLine++;
//            }
//        }
//        System.out.println("Total Utility: " + total);
//        System.out.println("Total Line: " + totalLine);
//    }
    //1 sv 2 transaction theo học kì
//    public void exportTransactionFile() throws IOException {
//        String outputPath = valueProperties.getFileExportTransaction();
//        boolean filterPassedSubjects = valueProperties.isFilterPassedSubjects();
//        List<Score> scores = scoreRepository.findAll();
//
//        // Nhóm điểm theo User ID, sau đó chỉ nhóm theo Học kỳ (bỏ qua Năm)
//        Map<String, Map<Integer, List<Score>>> groupedByUserAndSemester = scores.stream()
//                .collect(Collectors.groupingBy(score -> score.getUser().getId(), // Nhóm theo User ID
//                        Collectors.groupingBy(Score::getSemester))); // Tiếp theo nhóm theo Học kỳ
//
//        int total = 0;
//        int totalLine = 0; // Khởi tạo totalLine ở đây
//
//        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
//            // Duyệt qua từng sinh viên
//            for (Map.Entry<String, Map<Integer, List<Score>>> userEntry : groupedByUserAndSemester.entrySet()) {
//                // Duyệt qua từng học kỳ của sinh viên đó (ví dụ: Học kỳ 1, Học kỳ 2, v.v. - không phân biệt năm)
//                for (Map.Entry<Integer, List<Score>> semesterEntry : userEntry.getValue().entrySet()) {
//                    List<Score> semesterScores = semesterEntry.getValue(); // Lấy danh sách điểm của một học kỳ cụ thể (có thể từ nhiều năm)
//
//                    // Sắp xếp điểm trong học kỳ để đảm bảo thứ tự nhất quán trong mỗi giao dịch
//                    // Nên sắp xếp theo năm trước, sau đó là ID môn học, để giữ thứ tự nếu có điểm cùng học kỳ ở các năm khác nhau.
//                    semesterScores.sort(Comparator
//                            .comparing(Score::getYear) // Sắp xếp theo năm
//                            .thenComparing(score -> score.getSubject().getId())); // Sau đó theo ID môn học
//
//                    List<String> itemIDs = new ArrayList<>();
//                    long transactionUtilitySum = 0;
//
//                    // Xử lý từng điểm trong học kỳ đó
//                    for (Score score : semesterScores) {
//                        if (filterPassedSubjects && score.getPassed() != 1) {
//                            continue; // Bỏ qua nếu đang lọc và môn này chưa đạt
//                        }
//
//                        // Bạn có thể cân nhắc thêm năm vào item ID nếu muốn phân biệt
//                        // Ví dụ: itemIDs.add(String.valueOf(score.getSubject().getId()) + "_" + score.getYear() + "[" + Math.round(score.getUtility()) + "]");
//                        itemIDs.add(String.valueOf(score.getSubject().getId()) + "[" + Math.round(score.getUtility()) + "]");
//                        transactionUtilitySum += Math.round(score.getUtility());
//                    }
//
//                    if (itemIDs.isEmpty()) {
//                        continue; // Bỏ qua nếu không có môn nào trong học kỳ này sau khi lọc
//                    }
//
//                    // Mỗi dòng đại diện cho điểm của MỘT sinh viên trong MỘT loại học kỳ (ví dụ: tất cả điểm HK1 của SV đó qua các năm)
//                    String sequenceLine = String.join(" -1 ", itemIDs) + " -1 -2 S:" + transactionUtilitySum;
//                    writer.write(sequenceLine);
//                    writer.newLine();
//                    total += transactionUtilitySum;
//                    totalLine++; // Tăng totalLine lên sau khi ghi mỗi dòng giao dịch
//                }
//            }
//        }
//        System.out.println("Total Utility: " + total);
//        System.out.println("Total Line: " + totalLine);
//    }
//    public void exportTransactionFile() throws IOException {
//        String outputPath = valueProperties.getFileExportTransaction();
//        boolean filterPassedSubjects = valueProperties.isFilterPassedSubjects();
//        List<Score> allScores = scoreRepository.findAll();
//
//        // Bước 1: Tính tổng 'score' của từng sinh viên trong mỗi học kỳ của mỗi năm học
//        // Khóa của map này là chuỗi "userId_year_semester" và giá trị là tổng điểm float
//        Map<String, Double> tempTotalScoreBySemesterContext = allScores.stream()
//                .collect(Collectors.groupingBy(
//                        score -> String.valueOf(score.getUser().getId()) + "_" + score.getYear() + "_" + score.getSemester(),
//                        Collectors.summingDouble(Score::getScore) // Chỉ tính tổng là Double
//                ));
//        // Tạo Map cuối cùng với giá trị là Float
//        Map<String, Float> totalScoreBySemesterContext = tempTotalScoreBySemesterContext.entrySet().stream()
//                .collect(Collectors.toMap(
//                        Map.Entry::getKey,
//                        entry -> entry.getValue().floatValue() // Ép kiểu Double sang Float tại đây
//                ));
//
//        // Bước 2: Nhóm điểm chính theo User ID, sau đó theo Năm và Học kỳ
//        // Mỗi nhóm (User ID, Year, Semester) sẽ tạo thành một transaction riêng biệt
//        Map<String, Map<Integer, Map<Integer, List<Score>>>> groupedByUserAndSemester = allScores.stream()
//                .collect(Collectors.groupingBy(score -> score.getUser().getId(), // Group theo Long User ID
//                        Collectors.groupingBy(Score::getYear,
//                                Collectors.groupingBy(Score::getSemester))));
//
//        long totalUtilitySumOverall = 0; // Tổng utility của tất cả các giao dịch
//        int totalLine = 0; // Tổng số dòng (giao dịch) được xuất
//
//        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
//            // Duyệt qua từng sinh viên
//            for (Map.Entry<String, Map<Integer, Map<Integer, List<Score>>>> userEntry : groupedByUserAndSemester.entrySet()) {
//                // Duyệt qua từng năm học của sinh viên đó
//                for (Map.Entry<Integer, Map<Integer, List<Score>>> yearEntry : userEntry.getValue().entrySet()) {
//                    // Duyệt qua từng học kỳ trong năm học đó
//                    for (Map.Entry<Integer, List<Score>> semesterEntry : yearEntry.getValue().entrySet()) {
//                        List<Score> semesterScores = semesterEntry.getValue();
//
//                        // Sắp xếp điểm trong học kỳ theo Subject ID để đảm bảo thứ tự nhất quán
//                        semesterScores.sort(Comparator.comparing(score -> score.getSubject().getId()));
//
//                        List<String> itemIDs = new ArrayList<>();
//                        long transactionUtilitySum = 0; // Tổng utility cho giao dịch hiện tại
//
//                        // Lấy tổng score của ngữ cảnh học kỳ-năm hiện tại từ map đã tính ở Bước 1
//                        String currentContextKey = userEntry.getKey() + "_" + yearEntry.getKey() + "_" + semesterEntry.getKey();
//                        Float totalScoreInCurrentContext = totalScoreBySemesterContext.getOrDefault(currentContextKey, 0.0f);
//
//                        for (Score score : semesterScores) {
//                            if (filterPassedSubjects && score.getPassed() != 1) {
//                                continue; // Bỏ qua nếu đang lọc và môn này chưa pass
//                            }
//
//                            // Tính utility mới: score của môn đó / tổng score của học kỳ-năm
//                            double calculatedUtility = 0;
//                            if (totalScoreInCurrentContext > 0) { // Tránh chia cho 0
//                                calculatedUtility = score.getScore() / totalScoreInCurrentContext;
//                            }
//
//                            // Làm tròn utility và nhân hệ số để có giá trị nguyên
//                            // Ví dụ: nhân với 1000 để giữ độ chính xác của 3 chữ số thập phân
//                            long roundedUtility = Math.round(calculatedUtility * 1000);
//
//                            itemIDs.add(String.valueOf(score.getSubject().getId()) + "[" + roundedUtility + "]");
//                            transactionUtilitySum += roundedUtility;
//                        }
//
//                        if (itemIDs.isEmpty()) {
//                            continue; // Bỏ qua nếu không có môn nào trong học kỳ này sau khi lọc
//                        }
//
//                        // Ghi dòng giao dịch vào tệp
//                        String sequenceLine = String.join(" -1 ", itemIDs) + " -1 -2 S:" + transactionUtilitySum;
//                        writer.write(sequenceLine);
//                        writer.newLine();
//
//                        totalUtilitySumOverall += transactionUtilitySum; // Cộng dồn tổng utility chung
//                        totalLine++; // Đếm số dòng giao dịch được ghi ra
//                    }
//                }
//            }
//        }
//        System.out.println("Total Utility (Overall): " + totalUtilitySumOverall);
//        System.out.println("Total Lines Exported: " + totalLine);
//    }
    public void exportTransactionFile() throws IOException {
        String outputPath = valueProperties.getFileExportTransaction();
        boolean filterPassedSubjects = valueProperties.isFilterPassedSubjects();
        List<Score> allScores = scoreRepository.findAll();

        // Bước 1: Tính tổng 'score' của từng sinh viên trong mỗi học kỳ của mỗi năm học
        // Map này dùng để tính toán utility tương đối cho từng môn học
        Map<String, Double> tempTotalScoreBySemesterContext = allScores.stream()
                .collect(Collectors.groupingBy(
                        score -> String.valueOf(score.getUser().getId()) + "_" + score.getYear() + "_" + score.getSemester(),
                        Collectors.summingDouble(Score::getScore)
                ));

        Map<String, Float> totalScoreBySemesterContext = tempTotalScoreBySemesterContext.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().floatValue()
                ));

        // Bước 2: Nhóm tất cả các điểm theo User ID
        // Mỗi List<Score> sẽ chứa toàn bộ lịch sử học tập của một sinh viên
        Map<String, List<Score>> groupedByUser = allScores.stream()
                .collect(Collectors.groupingBy(score -> score.getUser().getId()));

        long totalUtilitySumOverall = 0; // Tổng utility của tất cả các chuỗi giao dịch được xuất
        int totalLine = 0; // Tổng số chuỗi giao dịch (tức là số sinh viên) được xuất

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
            // Duyệt qua từng sinh viên
            for (Map.Entry<String, List<Score>> userEntry : groupedByUser.entrySet()) {
                String userId = userEntry.getKey();
                List<Score> userScores = userEntry.getValue(); // Toàn bộ điểm của sinh viên này

                // Sắp xếp TẤT CẢ các điểm của sinh viên theo Năm, sau đó Học kỳ, sau đó ID môn học
                userScores.sort(Comparator
                        .comparing(Score::getYear)
                        .thenComparing(Score::getSemester)
                        .thenComparing(score -> score.getSubject().getId()));

                // Nhóm lại các môn học của sinh viên theo từng học kỳ (để tạo các itemset tuần tự)
                // Key của map này là "Year_Semester"
                Map<String, List<Score>> scoresBySemesterForUser = userScores.stream()
                        .collect(Collectors.groupingBy(score -> score.getYear() + "_" + score.getSemester()));

                // Sắp xếp các key học kỳ để đảm bảo thứ tự thời gian trong chuỗi
                List<String> sortedSemesterKeys = scoresBySemesterForUser.keySet().stream()
                        .sorted((key1, key2) -> {
                            // Phân tích key "Year_Semester" để sắp xếp đúng thứ tự
                            String[] parts1 = key1.split("_");
                            String[] parts2 = key2.split("_");
                            int year1 = Integer.parseInt(parts1[0]);
                            int semester1 = Integer.parseInt(parts1[1]);
                            int year2 = Integer.parseInt(parts2[0]);
                            int semester2 = Integer.parseInt(parts2[1]);

                            if (year1 != year2) {
                                return Integer.compare(year1, year2);
                            }
                            return Integer.compare(semester1, semester2);
                        })
                        .collect(Collectors.toList());

                StringBuilder sequenceLineBuilder = new StringBuilder(); // Để xây dựng một chuỗi giao dịch duy nhất cho sinh viên
                long sequenceTotalUtility = 0; // Tổng utility cho chuỗi của sinh viên hiện tại

                // Xây dựng chuỗi transaction cho từng sinh viên
                for (String semesterKey : sortedSemesterKeys) {
                    List<Score> semesterScores = scoresBySemesterForUser.get(semesterKey);

                    List<String> itemsetItems = new ArrayList<>(); // Các mục trong itemset của học kỳ hiện tại

                    // Tạo khóa để lấy tổng điểm của học kỳ/năm hiện tại của sinh viên này
                    String currentContextKey = String.valueOf(userId) + "_" + semesterKey;
                    Float totalScoreInCurrentContext = totalScoreBySemesterContext.getOrDefault(currentContextKey, 0.0f);

                    for (Score score : semesterScores) {
                        if (filterPassedSubjects && score.getPassed() != 1) {
                            continue; // Bỏ qua nếu đang lọc và môn này chưa pass
                        }

                        // Tính utility cho môn học: điểm của môn đó / tổng điểm của học kỳ/năm
                        double calculatedUtility = 0;
                        if (totalScoreInCurrentContext > 0) {
                            calculatedUtility = score.getScore() / totalScoreInCurrentContext;
                        }

                        // Làm tròn utility và nhân hệ số để có giá trị nguyên
                        long roundedUtility = Math.round(calculatedUtility * 1000);

                        itemsetItems.add(String.valueOf(score.getSubject().getId()) + "[" + roundedUtility + "]");
                        sequenceTotalUtility += roundedUtility; // Cộng dồn vào tổng utility của cả chuỗi giao dịch
                    }

                    // Thêm itemset (môn học của học kỳ) vào chuỗi giao dịch của sinh viên
                    if (!itemsetItems.isEmpty()) {
                        sequenceLineBuilder.append(String.join(" ", itemsetItems)).append(" -1 ");
                    }
                }

                // Ghi chuỗi giao dịch nếu nó không rỗng
                if (sequenceLineBuilder.length() > 0) {
                    // Loại bỏ "-1 " cuối cùng nếu có, trước khi thêm "-2 S:totalUtility"
                    if (sequenceLineBuilder.toString().endsWith(" -1 ")) {
                        sequenceLineBuilder.setLength(sequenceLineBuilder.length() - 4); // Xóa " -1 "
                    }
                    // Thêm dấu kết thúc chuỗi và tổng utility của cả chuỗi
                    sequenceLineBuilder.append(" -2 S:").append(sequenceTotalUtility);
                    writer.write(sequenceLineBuilder.toString());
                    writer.newLine();

                    totalUtilitySumOverall += sequenceTotalUtility;
                    totalLine++; // Mỗi dòng là một sinh viên
                }
            }
        }
        System.out.println("Total Utility (Overall): " + totalUtilitySumOverall);
        System.out.println("Total Lines Exported: " + totalLine);
    }
    //2
    public void runEFIM() throws IOException {
        String inputPath= valueProperties.getFileExportTransaction();
        String outputPath= valueProperties.getFileAlgoHUSRM();
        int maxAntecedentSize= valueProperties.getMaxAntecedentSize();
        int maxConsequentSize=valueProperties.getMaxConsequentSize();
        int maximumNumberOfSequences=Integer.MAX_VALUE;
        double minUtility = valueProperties.getMinUtility();
        double minUtilityConfidence = valueProperties.getMinUtilityConfidence();

        AlgoHUSRM algoHUSRM = new AlgoHUSRM();
        long startTime = System.currentTimeMillis();
        algoHUSRM.runAlgorithm(inputPath, outputPath, minUtilityConfidence, minUtility,maxAntecedentSize,maxConsequentSize,maximumNumberOfSequences);
        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;
        System.out.println("Thời gian chạy AlgoHUSRM: " +executionTime+ " ms");
        List<String> rulesReadFromFile = new ArrayList<>();
        try (BufferedReader reader = new BufferedReader(new FileReader(outputPath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (!line.trim().isEmpty()) { // Bỏ qua các dòng trống
                    rulesReadFromFile.add(line);
                }
            }
        }
        System.out.println("Tổng số luật kết hợp hữu ích được ghi ra file và đọc được: " + rulesReadFromFile.size());
        System.out.println("Luật đã được lưu vào: " + outputPath);
    }

    //3
    public void readAndSaveRules() throws IOException {
        String fileAlgoHUSRM= valueProperties.getFileAlgoHUSRM();
        ruleRepository.deleteAll();
        List<Rule> rulesToSave = new ArrayList<>();
        int parsedRulesCount = 0;
        // Ví dụ: 213603,214242,214321,214389 ==> 214352,214442 #SUP: 1.0 #CONF: 1.0 #UTIL: 139.0
        Pattern pattern = Pattern.compile(
                "(.+) ==> (.+) #SUP: (\\d+\\.?\\d*) #CONF: (\\d+\\.?\\d*) #UTIL: (\\d+\\.?\\d*)"
        );

        System.out.println("Bắt đầu đọc và phân tích file luật: " + fileAlgoHUSRM);

        try (BufferedReader reader = new BufferedReader(new FileReader(fileAlgoHUSRM))) {
            String line;
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue; // Bỏ qua dòng trống
                }

                Matcher matcher = pattern.matcher(line);
                if (matcher.matches()) {
                    String antecedentItems = matcher.group(1).trim(); // Nhóm 1: Antecedent
                    String consequentItems = matcher.group(2).trim(); // Nhóm 2: Consequent
                    BigDecimal support = new BigDecimal(matcher.group(3)).divide(new BigDecimal(1000)); // Nhóm 3: Support
                    BigDecimal confidence = new BigDecimal(matcher.group(4)); // Nhóm 4: Confidence
                    BigDecimal utility = new BigDecimal(matcher.group(5)); // Nhóm 5: Utility

                    Rule rule = new Rule();
                    rule.setAntecedentItems(antecedentItems);
                    rule.setConsequentItems(consequentItems);
                    rule.setSupport(support);
                    rule.setConfidence(confidence);
                    rule.setUtility(utility);

                    rulesToSave.add(rule);
                    parsedRulesCount++;
                } else {
                    System.err.println("Dòng không khớp định dạng luật và bị bỏ qua: " + line);
                }
            }
        }

        // Lưu tất cả các luật đã phân tích vào cơ sở dữ liệu
        if (!rulesToSave.isEmpty()) {
            ruleRepository.saveAll(rulesToSave);
            System.out.println("Đã lưu thành công " + rulesToSave.size() + " luật vào cơ sở dữ liệu.");
        } else {
            System.out.println("Không tìm thấy luật nào hợp lệ để lưu.");
        }
        System.out.println("Tổng số dòng luật được phân tích từ file: " + parsedRulesCount);

    }


    //
//    /**
//     * xét subject đưa vào có đủ điều kiện để được gợi ý không
//     * 1.
//     * @param subject
//     * @return
//     */
//    public boolean isEligible(Subject subject, int semester, Set<String> passedSubjectIds) {
//    //     Kiểm tra các môn tiên quyết (nếu có) của subject đã pass chưa
//        List<Prerequisite> prerequisites =prerequisiteRepository.findBySubject(subject);
//        for (Prerequisite prerequisite : prerequisites) {
//            Subject preSubject=prerequisite.getPrerequisiteSubject();
//            if (!passedSubjectIds.contains(preSubject.getId())) {
//                return false; // Chưa học hoặc chưa qua môn tiên quyết
//            }
//        }
//
//        // kiểm tra subject có được mở trong kỳ hiện tại không
//        List<CurriculumCourse> curriculumCourseList=curriculumCourseRepository.findCurriculumCourseBySemester(semester);
//        Set<String> subjectIdsInCurriculum = curriculumCourseList.stream()
//                .map(cc -> cc.getSubject().getId())
//                .collect(Collectors.toSet());
//        if(!subjectIdsInCurriculum.contains(subject.getId())) {
//            return false;
//        }
//
//        return true;
//    }
////4
//public Page<SubjectRecommendDTO> suggestSubjectsForUser(String userId, int semester, Pageable pageable) {
//    // Môn đã học và pass rồi
//    Set<String> learnedSubjectIds = scoreRepository.findByUserIdAndPassed(userId, 1)
//            .stream()
//            .map(score -> score.getSubject().getId())
//            .collect(Collectors.toSet());
//    // Lấy toàn bộ HUItemsets và sắp xếp theo utility giảm dần
//    List<HUItemset> huItemsets = HUItemsetRepository.findAll();
//    huItemsets.sort((a, b) -> Float.compare(b.getUtility(), a.getUtility())); // utility giảm dần
//    // Tránh gợi ý trùng
//    Set<SubjectRecommendDTO> suggestions = new LinkedHashSet<>();
//    // Duyệt từng itemset theo utility giảm dần
//    for (HUItemset huItemset : huItemsets) {
//        List<String> itemIds = huItemset.getItems();
//        // Nếu sinh viên đã học ít nhất 1 môn trong itemset → xét gợi ý
//        boolean hasLearnedOne = itemIds.stream().anyMatch(learnedSubjectIds::contains);
//        if (!hasLearnedOne) continue;
//        long countLearned= itemIds.stream().filter(learnedSubjectIds::contains).count();
//        double coverage= Math.round((double)countLearned/itemIds.size()*10)/10.0;
//        System.out.println(coverage);
////        if (coverage<0.5) continue;
//        for (String subjectId : itemIds) {
//
//            if (!learnedSubjectIds.contains(subjectId)) {  //nếu nó chưa học hoặc chưa pass
//                Subject subject = subjectRepository.findById(subjectId).orElse(null);
//                if (subject != null && isEligible(subject, semester, learnedSubjectIds)) {
//                    List<Subject> preSubjects = prerequisiteService.getAllPrerequisiteSubjectsBySubjectId(subject.getId());
//                    SubjectRecommendDTO dto = new SubjectRecommendDTO();
//                    dto.setSubject(subject);
//                    dto.setUtility(huItemset.getUtility());
//                    dto.setPreSubjects(preSubjects);
//                    suggestions.add(dto);
//                }
//            }
//        }
//    }
//
//    // Áp dụng phân trang thủ công
//    List<SubjectRecommendDTO> allSuggestions = new ArrayList<>(suggestions);
//    int total = allSuggestions.size();
//    int start = (int) pageable.getOffset();
//    int end = Math.min((start + pageable.getPageSize()), total);
//    List<SubjectRecommendDTO> pageContent = (start < end) ? allSuggestions.subList(start, end) : Collections.emptyList();
//
//    return new PageImpl<>(pageContent, pageable, total);
//}
    public Page<SubjectRecommendDTO> suggestSubjectsForUser(String userId, int semester, Pageable pageable) {
        System.out.println("hhhhhhhhhh");
        // Môn đã học và pass rồi
        Set<String> learnedSubjectIds = scoreRepository.findByUserIdAndPassed(userId, 1)
                .stream()
                .map(score -> score.getSubject().getId())
                .collect(Collectors.toSet());

        // Lấy danh sách curriculum môn học trong kỳ (1 lần)
        List<CurriculumCourse> curriculumCourseList = curriculumCourseRepository.findCurriculumCourseBySemester(semester);
        Set<String> subjectIdsInCurriculum = curriculumCourseList.stream()
                .map(cc -> cc.getSubject().getId())
                .collect(Collectors.toSet());

        // Load tất cả Subject trong hoc ki này 1 lần
        Map<String, Subject> subjectInCurriculum = subjectRepository.findAllById(subjectIdsInCurriculum).stream()
                .collect(Collectors.toMap(Subject::getId, Function.identity()));
        // Lấy rule theo utility giảm dần
        List<RuleActive> rules = ruleActiveRepository.findAllByOrderByUtilityDesc();
        // Gom tất cả subjectId từ rules (để load sẵn Subjects, tránh gọi từng cái)
        Set<String> allSubjectIds = rules.stream()
                .map(RuleActive::getConsequentItems)
                .map(String ::trim)
                .collect(Collectors.toSet());

        // Load tất cả Subject 1 lần
        Map<String, Subject> subjectMap = subjectRepository.findAllById(allSubjectIds).stream()
                .collect(Collectors.toMap(Subject::getId, Function.identity()));

        // Load tất cả prerequisite 1 lần cho các subject cần xét (cần thêm method findBySubjects)
        List<Prerequisite> allPrerequisites = prerequisiteRepository.findBySubjectIn(new ArrayList<>(subjectMap.values()));
        // Map subjectId -> List<Prerequisite>
        Map<String, List<Prerequisite>> prerequisiteMap = allPrerequisites.stream()
                .collect(Collectors.groupingBy(pr -> pr.getSubject().getId()));

        Set<SubjectRecommendDTO> suggestions = new LinkedHashSet<>();
        for(String subjectId:subjectIdsInCurriculum ){
            if(learnedSubjectIds.contains(subjectId)){
                continue;
            }
            Subject subject = subjectInCurriculum.get(subjectId);
            if(subject.getSubjectGroup().getId().equals("BB")){
                List<Prerequisite> prerequisites = prerequisiteMap.getOrDefault(subjectId, Collections.emptyList());
                boolean eligible = prerequisites.stream()
                        .allMatch(pr -> learnedSubjectIds.contains(pr.getPrerequisiteSubject().getId()));

                if (eligible) {
                List<Subject> preSubjects = prerequisites.stream()
                        .map(Prerequisite::getPrerequisiteSubject)
                        .collect(Collectors.toList());
                SubjectRecommendDTO subjectRecommendDTO = new SubjectRecommendDTO();
                subjectRecommendDTO.setSubject(subject);
                subjectRecommendDTO.setPreSubjects(preSubjects);
                subjectRecommendDTO.setUtility(-1);
                suggestions.add(subjectRecommendDTO);
            }}
        }

        for (RuleActive rule : rules) {
            System.out.println(rule);
            List<String> itemIds = Arrays.stream(rule.getAntecedentItems().split(",")) // Split the string by comma
                    .map(String::trim) // Trim whitespace from each individual ID
                    .collect(Collectors.toList()); // Collect them into a List<String>
            boolean hasLearnedAllAntecedent = itemIds.stream().allMatch(learnedSubjectIds::contains);
            System.out.println(hasLearnedAllAntecedent);
            if (!hasLearnedAllAntecedent) continue;
            String consequentSubjectId = rule.getConsequentItems();
            System.out.println(consequentSubjectId);
//            for (String subjectId : itemIds) {
                if (!learnedSubjectIds.contains(consequentSubjectId)) {
                    Subject subject = subjectMap.get(consequentSubjectId);
                    System.out.println(subject);
                    if (subject == null) continue;
                    if (!subjectIdsInCurriculum.contains(consequentSubjectId)) continue;

                    // Kiểm tra eligibility dựa trên prerequisite đã load sẵn
                    List<Prerequisite> prerequisites = prerequisiteMap.getOrDefault(consequentSubjectId, Collections.emptyList());
                    boolean eligible = prerequisites.stream()
                            .allMatch(pr -> learnedSubjectIds.contains(pr.getPrerequisiteSubject().getId()));

                    if (eligible) {
                        List<Subject> preSubjects = prerequisites.stream()
                                .map(Prerequisite::getPrerequisiteSubject)
                                .collect(Collectors.toList());

                        SubjectRecommendDTO dto = new SubjectRecommendDTO();
                        dto.setSubject(subject);
                        dto.setUtility(rule.getUtility().floatValue());
                        dto.setPreSubjects(preSubjects);
                        suggestions.add(dto);
                    }
                }
//            }
        }


        // Phân trang thủ công
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
    public void transFromRuleToRuleActive(){
        ruleActiveRepository.deleteAll();
        List<Rule> rules=ruleRepository.findAll();
        List<RuleActive> ruleActives=new ArrayList<>();
        for(Rule rule: rules){
            ruleActives.add(new RuleActive(rule));
        }
        ruleActiveRepository.saveAll(ruleActives);
    }


}
