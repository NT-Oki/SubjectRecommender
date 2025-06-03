package org.example.subjectrecommender.dto;

import jakarta.persistence.Column;
import lombok.Data;
import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Model.Subject;

import java.util.List;

@Data
public class ScoreAdminDto {
    private Long id;
    private UserDTO user;
    private Subject subject;
    private int semester;
    private float score;
    private int passed;//qua mon 0(no) 1(yes)
    private int year;//nam da hoc mon nay
    private float utility;
    private List<Subject> preSubjects;

    public ScoreAdminDto(Score score, List<Subject> preSubjects) {
        this.id = score.getId();
        this.user = new UserDTO(score.getUser());
        this.subject = score.getSubject();
        this.semester = score.getSemester();
        this.score = score.getScore();
        this.passed = score.getPassed();
        this.year = score.getYear();
        this.utility = score.getUtility();
        this.preSubjects = preSubjects;
    }

}
