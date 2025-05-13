package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Repository.ScoreRepository;
import org.springframework.stereotype.Service;

@Service
public class ScoreService {
    ScoreRepository scoreRepository;
    public ScoreService(ScoreRepository scoreRepository) {
        this.scoreRepository = scoreRepository;
    }
    public void save (Score score) {
        scoreRepository.save(score);
    }
}
