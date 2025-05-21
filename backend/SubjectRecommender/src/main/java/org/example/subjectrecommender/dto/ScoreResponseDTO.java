package org.example.subjectrecommender.dto;

import jakarta.persistence.Column;
import lombok.Data;
import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Model.Subject;

@Data
public class ScoreResponseDTO {
    private Long id;
    private String userId;
    private Subject subject;
    private int semester;
    private float score;
    private int passed;//qua mon 0(no) 1(yes)
    private int year;//nam da hoc mon nay
    private float utility;

    public ScoreResponseDTO(Score score) {
        this.id = score.getId();
        this.userId = score.getUser().getId();
        this.subject = score.getSubject();
        this.semester = score.getSemester();
        this.score = score.getScore();
        this.passed = score.getPassed();
        this.year = score.getYear();
        this.utility = score.getUtility();
    }
}
