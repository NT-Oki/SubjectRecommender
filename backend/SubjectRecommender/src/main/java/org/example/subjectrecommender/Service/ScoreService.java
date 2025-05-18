package org.example.subjectrecommender.Service;

import jakarta.transaction.Transactional;
import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Repository.ScoreRepository;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ScoreService {
    ScoreRepository scoreRepository;
    public ScoreService(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }
    public void save (Score score) {
        scoreRepository.save(score);
    }
//    public void update(String col){
//        scoreRepository.updateByIdAnd()
//    }
@Transactional
public void updateAllUtility() {
    List<Score> scores = scoreRepository.findAll();
    for (Score score : scores) {
        if (score.getSubject() != null ) {
            score.setUtility(score.getScore() * score.getSubject().getCredit());
        } else {
            score.setUtility(0);
        }
    }
    scoreRepository.saveAll(scores);
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
    System.out.println(total+"aaaaaaaaaaaaaa");
}
    //3
public List<List<Integer>> readItemsets(String efimResultFile) throws IOException {
    List<List<Integer>> itemsets = new ArrayList<>();
    List<String> lines = Files.readAllLines(Paths.get(efimResultFile));
    for (String line : lines) {
        String[] parts = line.split(" #UTIL:");
        List<Integer> itemset = Arrays.stream(parts[0].trim().split(" "))
                .map(Integer::parseInt)
                .collect(Collectors.toList());
        System.out.println(itemset);
        itemsets.add(itemset);
    }
    return itemsets;
}
//   // 4
//    public List<Subject> suggestSubjectsForUser(User user, List<List<Integer>> itemsets,String efimResultFile) throws IOException {
//        itemsets=readItemsets(efimResultFile);
//        Set<Long> learnedSubjectIds = scoreRepository.findByUser(user)
//                .stream().map(score -> score.getSubject().getId()).collect(Collectors.toSet());
//
//        List<Subject> suggestions = new ArrayList<>();
//
//        for (List<Integer> itemset : itemsets) {
//            for (Integer subjectId : itemset) {
//                if (!learnedSubjectIds.contains(subjectId.longValue())) {
//                    Subject subject = subjectRepository.findById(subjectId.longValue()).orElse(null);
//                    if (subject != null && isEligible(user, subject)) {
//                        suggestions.add(subject);
//                    }
//                }
//            }
//        }
//        return suggestions;
//    }
//public List<Subject> suggestSubjectsForUser(User user, List<List<Integer>> itemsets, String efimResultFile) throws IOException {
//    itemsets = readItemsets(efimResultFile);
//
//    // Môn đã học
//    Set<String> learnedSubjectIds = scoreRepository.findByUser(user)
//            .stream().map(score -> score.getSubject().getId()).collect(Collectors.toSet());
//
//    // Tránh gợi ý trùng
//    Set<Subject> suggestions = new LinkedHashSet<>(); // giữ thứ tự
//
//    for (List<Integer> itemset : itemsets) {
//        for (Integer subjectId : itemset) {
//            long sid = subjectId.longValue();
//            if (!learnedSubjectIds.contains(sid)) {
//                Subject subject = subjectRepository.findById(sid).orElse(null);
//                if (subject != null && isEligible(user, subject)) {
//                    suggestions.add(subject);
//                }
//            }
//        }
//    }
//    return new ArrayList<>(suggestions);
//}

//    //5
//    public boolean isEligible(User user, Subject subject) {
//        List<Subject> requiredSubjects = subject.getPrerequisites(); // Giả sử có quan hệ @ManyToMany
//        Set<Long> learned = scoreRepository.findByUser(user).stream()
//                .map(score -> score.getSubject().getId()).collect(Collectors.toSet());
//
//        for (Subject req : requiredSubjects) {
//            if (!learned.contains(req.getId())) return false;
//        }
//
//        // Kiểm tra học kỳ hiện tại (ví dụ user đang học kỳ 5)
//        return subject.getSemester() <= user.getCurrentSemester();
//    }
//    //6
//    public List<Subject> suggestForUser(User user, String efimOutputPath) throws IOException {
//        List<List<Integer>> itemsets = readItemsets(efimOutputPath);
//        return suggestSubjectsForUser(user, itemsets);
//    }


}
