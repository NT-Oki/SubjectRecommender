package org.example.subjectrecommender.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "equivalentsubjects")
public class EquivalentSubject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "old_subject_id")
    private Subject subject_old;
    @ManyToOne
    @JoinColumn(name = "new_subject_id")
    private Subject subject_new;


}
