package org.example.subjectrecommender.Model;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.UpdateTimestamp;

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
    @Column(name = "year")
    private int year;//nam da hoc mon nay
    @Column(name = "utility")
    private float utility;
    @PrePersist
    @PreUpdate
    private void updateUtilityAutomatically() {
        if(subject==null) {
            this.utility=0;
        }else{
            this.utility=score*subject.getCredit();
        }
    }

}
