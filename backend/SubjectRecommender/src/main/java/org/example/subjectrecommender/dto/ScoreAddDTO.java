package org.example.subjectrecommender.dto;

import lombok.Data;

@Data
public class ScoreAddDTO {
    private String userId;
    private String subjectId;
    private int semester;
    private int year;
    private float score;
}


