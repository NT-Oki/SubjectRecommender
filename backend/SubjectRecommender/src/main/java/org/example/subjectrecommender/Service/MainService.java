package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Repository.ScoreRepository;
import org.example.subjectrecommender.Repository.SubjectRepository;
import org.example.subjectrecommender.util.Algorithm;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MainService {
    ScoreRepository scoreRepository;
    SubjectRepository subjectRepository;
    public MainService(ScoreRepository scoreRepository, SubjectRepository subjectRepository) {
        this.scoreRepository = scoreRepository;
        this.subjectRepository = subjectRepository;
    }
    public boolean isEligible(User user, Subject subject) {
        // Lấy danh sách môn đã học và qua
        List<Score> passedScores = scoreRepository.findByUserAndPassed(user, 1);
        Set<String> passedSubjectIds = passedScores.stream()
                .map(score -> score.getSubject().getId())
                .collect(Collectors.toSet());

//        // Kiểm tra các môn tiên quyết (nếu có)
//        for (Subject prerequisite : subject.getPrerequisites()) {
//            if (!passedSubjectIds.contains(prerequisite.getId())) {
//                return false; // Chưa học hoặc chưa qua môn tiên quyết
//            }
//        }

//        // Ví dụ: kiểm tra môn có được mở trong kỳ hiện tại không
//        if (!subject.isOpenedInCurrentSemester()) {
//            return false;
//        }

        return true;
    }

//    public List<Subject> suggestSubjectsForUser(User user, List<List<Integer>> itemsets, String efimResultFile) throws IOException {
public List<Subject> suggestSubjectsForUser(User user, String efimResultFile) throws IOException {
    List<List<Integer>> itemsets = Algorithm.readItemsets(efimResultFile);

        // Môn đã học
        Set<String> learnedSubjectIds = scoreRepository.findByUser(user)
                .stream().map(score -> score.getSubject().getId()).collect(Collectors.toSet());

        // Tránh gợi ý trùng
        Set<Subject> suggestions = new LinkedHashSet<>(); // giữ thứ tự

        for (List<Integer> itemset : itemsets) {
            for (Integer subjectId : itemset) {
                String sid = String.valueOf(subjectId.longValue());
                if (!learnedSubjectIds.contains(sid)) {
                    Subject subject = subjectRepository.findById(sid).orElse(null);
                    if (subject != null && isEligible(user, subject)) {
                        System.out.println(subject);
                        System.out.println("oke");
                        suggestions.add(subject);
                    }
                }
            }
        }
        return new ArrayList<>(suggestions);
    }
}
