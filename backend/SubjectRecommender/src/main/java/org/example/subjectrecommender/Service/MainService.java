package org.example.subjectrecommender.Service;
import ca.pfv.spmf.algorithms.sequential_rules.husrm.AlgoHUSRM;
import org.example.subjectrecommender.Model.*;
import org.example.subjectrecommender.Repository.*;
import org.example.subjectrecommender.config.ValueProperties;
import org.example.subjectrecommender.dto.SubjectGroupRequirementDTO;
import org.example.subjectrecommender.dto.SubjectRecommendDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
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
    public void exportTransactionFile() throws IOException {
        String outputPath = valueProperties.getFileExportTransaction();
        boolean filterPassedSubjects = valueProperties.isFilterPassedSubjects();
        List<Score> allScores = scoreRepository.findAll();
        // Bước 1: Tính tổng 'score' của từng sinh viên trong mỗi học kỳ của mỗi năm học [mssv_2021_1]
        Map<String, Double> tempTotalScoreBySemesterContext = allScores.stream()
                .collect(Collectors.groupingBy(
                        score -> score.getUser().getId() + "_" + score.getYear() + "_" + score.getSemester(),
                        Collectors.summingDouble(Score::getScore)
                ));
        // tính toán tổng điếm của từng sinh viên trong 1 hki  -> [mssv_2021_1, score ]
        Map<String, Float> totalScoreBySemesterContext = tempTotalScoreBySemesterContext.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().floatValue()
                ));

        // Bước 2: Nhóm tất cả các điểm theo User ID
        // Mỗi List<Score> sẽ chứa toàn bộ lịch sử học tập của một sinh viên [mssv,score[]]
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
                            continue; // Bỏ qua nếu đang kích hoạt lọc  với môn chưa pass( pass:lấy, chưa pass: bỏ qua)
                        }

                        // Tính utility cho môn học: điểm của môn đó / tổng điểm của học kỳ/năm rồi nhân số tín chỉ=utility/tổng điểm
                        double calculatedUtility = 0;
                        if (totalScoreInCurrentContext > 0) {
                            calculatedUtility = score.getUtility() / totalScoreInCurrentContext;
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
        valueProperties.setTotalTransaction(totalLine);
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
        ruleRepository.truncate();
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
                    BigDecimal support = new BigDecimal(matcher.group(3)).divide(new BigDecimal(valueProperties.getTotalTransaction()),8, RoundingMode.HALF_UP).multiply(new BigDecimal(100)); // Nhóm 3: Support
                    BigDecimal confidence = new BigDecimal(matcher.group(4)); // Nhóm 4: Confidence
                    BigDecimal utility = new BigDecimal(matcher.group(5)).divide(new BigDecimal(1000)); // Nhóm 5: Utility

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
    public Map<String, List<SubjectRecommendDTO>> sortBy(List<SubjectRecommendDTO> dtoList){
        Map<String, List<SubjectRecommendDTO>> map = new TreeMap<>(new Comparator<String>() {

            @Override
            public int compare(String o1, String o2) {
                String[] value1 = o1.split("-");
                String[] value2 = o2.split("-");
                int year1=Integer.parseInt(value1[1].replace("Năm "," ").trim());
                int year2=Integer.parseInt(value2[1].replace("Năm "," ").trim());
                if(year1!=year2){
                    return year1-year2;
                }
                int semester1=Integer.parseInt(value1[0].replace("Học kỳ "," ").trim());
                int semester2=Integer.parseInt(value2[0].replace("Học kỳ "," ").trim());
                return semester1-semester2;

            }
        });
            for(SubjectRecommendDTO dto: dtoList){
                String key= "Học kỳ "+dto.getSemester()+"- Năm "+dto.getYear();
                if(!map.containsKey(key)){
                    map.put(key,new ArrayList<SubjectRecommendDTO>());
                }
                map.get(key).add(dto);
            }
                return  map;

    }
    public List<SubjectRecommendDTO> suggestSubjectsForUser(String userId, int semester) {
        System.out.println("hhhhhhhhhh");
        // Môn đã học và pass rồi
        Set<String> learnedSubjectIds = scoreRepository.findByUserIdAndPassed(userId, 1)
                .stream()
                .map(score -> score.getSubject().getId())
                .collect(Collectors.toSet());
        // Lấy danh sách curriculum môn học trong kỳ này
        List<CurriculumCourse> curriculumCourseList = curriculumCourseRepository.findCurriculumCourseBySemester(semester);
        Set<String> subjectIdsInCurriculum = curriculumCourseList.stream()
                .map(cc -> cc.getSubject().getId())
                .collect(Collectors.toSet());
        // Load tất cả Subject được mở trong hoc ki này
        Map<String, Subject> subjectInCurriculum = subjectRepository.findAllById(subjectIdsInCurriculum).stream()
                .collect(Collectors.toMap(Subject::getId, Function.identity()));
        // Lấy rule theo utility giảm dần
        List<RuleActive> rules = ruleActiveRepository.findAllByOrderByUtilityDesc();
        // Gom tất cả subjectId từ rules (để load sẵn Subjects, tránh gọi từng cái)
        Set<String> allSubjectIds = rules.stream()
                .map(RuleActive::getConsequentItems)
                .map(String ::trim)
                .collect(Collectors.toSet());

        // Load tất cả Subject 1 lần trong rule
        Map<String, Subject> subjectMap = subjectRepository.findAllById(allSubjectIds).stream()
                .collect(Collectors.toMap(Subject::getId, Function.identity()));

        // Load tất cả prerequisite 1 lần
        List<Prerequisite> allPrerequisites = prerequisiteRepository.findAll();
        System.out.println("preeeeeeee"+allPrerequisites);
        // Map subjectId -> List<Prerequisite>
        Map<String, List<Prerequisite>> prerequisiteMap = allPrerequisites.stream()
                .collect(Collectors.groupingBy(pr -> pr.getSubject().getId()));

        Set<SubjectRecommendDTO> suggestions = new LinkedHashSet<>();
        List<String> recommendedsubjectId=new ArrayList<>();//danh sách id môn học đã được bỏ vào gợi ý
        for(String subjectId:subjectIdsInCurriculum ){
            if(learnedSubjectIds.contains(subjectId)){
                continue;
            }
            Subject subject = subjectInCurriculum.get(subjectId);
            if(subject.getSubjectGroup().getId().equals("BB")){
                CurriculumCourse course=curriculumCourseList.stream()
                        .filter(c -> c.getSubject() != null && subjectId.equals(c.getSubject().getId()))
                        .findFirst().orElse(null);
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
                subjectRecommendDTO.setSemester(course.getSemester());
                subjectRecommendDTO.setYear(course.getYear());
                suggestions.add(subjectRecommendDTO);
                recommendedsubjectId.add(subjectId);
            }}
        }

        for (RuleActive rule : rules) {
            System.out.println(rule);
            List<String> itemIds = Arrays.stream(rule.getAntecedentItems().split(",")) // Split the string by comma
                    .map(String::trim) // Trim whitespace from each individual ID
                    .collect(Collectors.toList()); // Collect them into a List<String>
            boolean hasLearnedAllAntecedent = itemIds.stream().allMatch(learnedSubjectIds::contains);
            if (!hasLearnedAllAntecedent) continue;
            String consequentSubjectId = rule.getConsequentItems();//môn gợi ý
            if(recommendedsubjectId.contains(consequentSubjectId)||learnedSubjectIds.contains(consequentSubjectId)){
                continue;
            }
//            for (String subjectId : itemIds)
                    Subject subject = subjectMap.get(consequentSubjectId);
                    if (subject == null) continue;
                    if (!subjectIdsInCurriculum.contains(consequentSubjectId)) continue;
                    // Kiểm tra eligibility dựa trên prerequisite đã load sẵn
                    List<Prerequisite> prerequisites = prerequisiteMap.getOrDefault(consequentSubjectId, Collections.emptyList());
                    boolean eligible = prerequisites.stream()
                            .allMatch(pr -> learnedSubjectIds.contains(pr.getPrerequisiteSubject().getId()));
                    if(!eligible){
                        continue;
                    }
                        CurriculumCourse course=curriculumCourseList.stream()
                                .filter(c -> c.getSubject() != null && consequentSubjectId.equals(c.getSubject().getId()))
                                .findFirst().orElse(null);
                        List<Subject> preSubjects = prerequisites.stream()
                                .map(Prerequisite::getPrerequisiteSubject)
                                .collect(Collectors.toList());
                        SubjectRecommendDTO dto = new SubjectRecommendDTO();
                        dto.setSubject(subject);
                        dto.setUtility(rule.getUtility());
                        dto.setPreSubjects(preSubjects);
                        dto.setSemester(course.getSemester());
                        dto.setYear(course.getYear());
                        dto.setSupport(rule.getSupport());
                        dto.setConfidence(rule.getConfidence());
                        suggestions.add(dto);
                    }

//        // Phân trang thủ công
//        List<SubjectRecommendDTO> allSuggestions = new ArrayList<>(suggestions);
//        int total = allSuggestions.size();
//        int start = (int) pageable.getOffset();
//        int end = Math.min((start + pageable.getPageSize()), total);
//        List<SubjectRecommendDTO> pageContent = (start < end) ? allSuggestions.subList(start, end) : Collections.emptyList();

//        return new PageImpl<>(pageContent, pageable, total);
        return new ArrayList<>(suggestions);
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
        ruleActiveRepository.truncate();
        List<Rule> rules=ruleRepository.findAll();
        List<RuleActive> ruleActives=new ArrayList<>();
        for(Rule rule: rules){
            ruleActives.add(new RuleActive(rule));
        }
        ruleActiveRepository.saveAll(ruleActives);
        System.out.println("Đã chuyển dữ liệu từ Rule sang RuleActive " + ruleActives.size());

    }


}
