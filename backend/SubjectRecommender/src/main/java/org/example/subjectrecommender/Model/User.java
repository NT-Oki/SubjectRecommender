package org.example.subjectrecommender.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @Column(name = "id")
    private String id;
    @Column(name = "last_name")
    private String lastName;
    @Column(name = "name")
    private String name;
    @Column(name = "major")
    private String major;
    @Column(name = "password")
    private String password;
    @Column(name = "enrollment_year")
    private int enrollmentYear;
    @Column(name="role")
    private int role;//1 admin 2 student
    @ManyToOne
    @JoinColumn(name = "curriculum_id")
    private CurriculumVersion curriculumVersion;



}
