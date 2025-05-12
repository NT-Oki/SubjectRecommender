package org.example.subjectrecommender.Model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "subjects")
public class Subject {
    @Id
    @Column(name = "id")
    private String id;
    @Column(name = "subject_name")
    private String subjectName;
    @Column(name = "credit")
    private int credit;
    @ManyToOne
    @JoinColumn(name = "group_id")
    private SubjectGroup subjectGroup;
}
