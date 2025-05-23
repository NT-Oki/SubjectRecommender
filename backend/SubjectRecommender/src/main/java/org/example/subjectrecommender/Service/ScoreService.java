package org.example.subjectrecommender.Service;

import jakarta.transaction.Transactional;
import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.User;
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
        public Map<String, List<ScoreResponseDTO>> getGroupedScoresByUser(String userId) {
            List<Score> scores = scoreRepository.findAllByUserId(userId);

            Comparator<String> cmp = Comparator.comparingInt((String k) -> {
                String[] parts = k.split(" - ");
                return Integer.parseInt(parts[1].replace("Năm học ", "").trim());
            }).thenComparingInt(k -> {
                String[] parts = k.split(" - ");
                return Integer.parseInt(parts[0].replace("Học kỳ ", "").trim());
            });

            return scores.stream()
                    .map(ScoreResponseDTO::new)
                    .collect(Collectors.groupingBy(
                            dto -> "Học kỳ " + dto.getSemester() + " - Năm học " + dto.getYear() + " - " + (dto.getYear()+1),
                            () -> new TreeMap<>(cmp),
                            Collectors.toList()
                    ));
        }

    }
