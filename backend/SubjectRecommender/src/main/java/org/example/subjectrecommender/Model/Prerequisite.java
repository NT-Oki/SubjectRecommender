package org.example.subjectrecommender.Model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "prerequisites")
public class Prerequisite {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;
    @ManyToOne
    @JoinColumn(name = "pre_subject_id")
    private Subject prerequisiteSubject;



}
