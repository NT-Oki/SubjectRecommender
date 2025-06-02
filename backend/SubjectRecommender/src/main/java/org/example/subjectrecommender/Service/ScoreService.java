package org.example.subjectrecommender.Service;

import jakarta.transaction.Transactional;
import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Repository.PrerequisiteRepository;
import org.example.subjectrecommender.Repository.ScoreRepository;
import org.example.subjectrecommender.dto.ScoreResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
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
        @Autowired
        ScoreRepository scoreRepository;
        @Autowired
        PrerequisiteService prerequisiteService;
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
//        public Map<String, List<ScoreResponseDTO>> getGroupedScoresByUser(String userId) {
//            List<Score> scores = scoreRepository.findAllByUserId(userId);
//
//            Comparator<String> cmp = Comparator.comparingInt((String k) -> {
//                String[] parts = k.split(" - ");
//                return Integer.parseInt(parts[1].replace("Năm học ", "").trim());
//            }).thenComparingInt(k -> {
//                String[] parts = k.split(" - ");
//                return Integer.parseInt(parts[0].replace("Học kỳ ", "").trim());
//            });
//
//            return scores.stream()
//                    .map(ScoreResponseDTO::new)
//                    .collect(Collectors.groupingBy(
//                            dto -> "Học kỳ " + dto.getSemester() + " - Năm học " + dto.getYear() + " - " + (dto.getYear()+1),
//                            () -> new TreeMap<>(cmp),
//                            Collectors.toList()
//                    ));
//        }
public Map<String, List<ScoreResponseDTO>> getGroupedScoresByUser(String userId) {
    List<Score> scores = scoreRepository.findAllByUserId(userId);
    Map<String, List<ScoreResponseDTO>> result = new TreeMap<String, List<ScoreResponseDTO>>(new Comparator<String>() {
        @Override
        public int compare(String o1, String o2) {
            String[] parts1 = o1.split(" - ");
            String[] parts2 = o2.split(" - ");

            int year1 = Integer.parseInt(parts1[1].replace("Năm học ", "").trim());
            int year2 = Integer.parseInt(parts2[1].replace("Năm học ", "").trim());

            if (year1 != year2) {
                return year1 - year2;
            }

            int semester1 = Integer.parseInt(parts1[0].replace("Học kỳ ", "").trim());
            int semester2 = Integer.parseInt(parts2[0].replace("Học kỳ ", "").trim());

            return semester1 - semester2;
        }
    });

    for (Score score : scores) {
        List<Subject> preSubjects = prerequisiteService.getAllPrerequisiteSubjectsBySubjectId(score.getSubject().getId());
        ScoreResponseDTO dto = new ScoreResponseDTO(score, preSubjects);

        String key = "Học kỳ " + dto.getSemester() + " - Năm học " + dto.getYear() + " - " + (dto.getYear() + 1);
        if (!result.containsKey(key)) {
            result.put(key, new ArrayList<ScoreResponseDTO>());
        }
        result.get(key).add(dto);
    }

    return result;
}


    }
