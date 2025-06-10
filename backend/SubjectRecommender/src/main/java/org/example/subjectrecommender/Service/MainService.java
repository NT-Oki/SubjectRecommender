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

    //1
    public void exportTransactionFile() throws IOException {
        String outputPath= valueProperties.getFileExportTransaction();
        boolean filterPassedSubjects = valueProperties.isFilterPassedSubjects();
        List<Score> scores = scoreRepository.findAll();
        Map<String, List<Score>> groupedByUser = scores.stream()
                .collect(Collectors.groupingBy(score -> score.getUser().getId()));
        int total=0;
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(outputPath))) {
            for (Map.Entry<String, List<Score>> entry : groupedByUser.entrySet()) {
                List<Score> userScores = entry.getValue();
                userScores.sort(Comparator
                        .comparing(Score::getYear)
                        .thenComparing(Score::getSemester));
                List<String> itemIDs = new ArrayList<>();
                List<String> itemUtilities = new ArrayList<>();
                long transactionUtilitySum = 0;
                for (Score score : userScores) {
                    if (filterPassedSubjects && score.getPassed() != 1) {
                        continue; // Bỏ qua nếu đang lọc và môn này chưa pass
                    }

                    itemIDs.add(String.valueOf(score.getSubject().getId())+"["+Math.round(score.getUtility())+"]");
                    long roundedUtility = Math.round(score.getUtility());
                    itemUtilities.add(String.valueOf(roundedUtility));
                    transactionUtilitySum += roundedUtility;
                }
                if (itemIDs.isEmpty()) {
                    continue;
                }
                String sequenceLine = String.join(" -1 ", itemIDs) + " -1 -2 S:" + transactionUtilitySum;
                writer.write(sequenceLine);
                writer.newLine();
                total += transactionUtilitySum;
            }
        }
        System.out.println("Total Utility: " + total);
    }
    //2
    public void runEFIM() throws IOException {
        String inputPath= valueProperties.getFileExportTransaction();
        String outputPath= valueProperties.getFileAlgoHUSRM();
        int maxAntecedentSize=6;
        int maxConsequentSize=1;
        int maximumNumberOfSequences=Integer.MAX_VALUE;
        double minUtility = valueProperties.getMinUtility();
        double minUtilityConfidence = 0.8;

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

        for (RuleActive rule : rules) {
            System.out.println(rule);
            List<String> itemIds = Arrays.stream(rule.getAntecedentItems().split(",")) // Split the string by comma
                    .map(String::trim) // Trim whitespace from each individual ID
                    .collect(Collectors.toList()); // Collect them into a List<String>
            boolean hasLearnedAllAntecedent = itemIds.stream().allMatch(learnedSubjectIds::contains);
            System.out.println(hasLearnedAllAntecedent);
            if (!hasLearnedAllAntecedent) continue;
            String consequentSubjectId=rule.getConsequentItems();
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
