package org.example.subjectrecommender.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "curriculumcourses")
public class CurriculumCourse {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "curriculum_id")
    private CurriculumVersion curriculum;
    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
    @Column(name = "semester")
    private int semester;//hoc ki mo
    @Column(name = "year")
    private int year;//năm mở môn
    @Column(name = "required")
    private int required;//co bat buoc khong , 0(no) 1(yes)

}
