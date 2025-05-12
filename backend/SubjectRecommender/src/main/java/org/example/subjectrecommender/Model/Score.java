package org.example.subjectrecommender.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "scores")
public class Score {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
    @Column(name = "semester")
    private int semester;//hoc ki da hoc mon nay
    @Column(name = "score")
    private float score;
    @Column(name = "passed")
    private int passed;//qua mon 0(no) 1(yes)



}
