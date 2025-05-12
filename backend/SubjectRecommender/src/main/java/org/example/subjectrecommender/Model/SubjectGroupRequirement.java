package org.example.subjectrecommender.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "subjectgrouprequirements")
public class SubjectGroupRequirement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "curriculum_version_id")
    private CurriculumVersion curriculumVersion;
    @ManyToOne
    @JoinColumn(name = "subject_group_id)")
    private SubjectGroup subjectGroup;
    @Column(name = "required_credit")
    private int requiredCredit;


}
