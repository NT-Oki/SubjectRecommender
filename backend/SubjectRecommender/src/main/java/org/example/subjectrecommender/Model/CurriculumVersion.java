package org.example.subjectrecommender.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "curriculumversions")
public class CurriculumVersion {
    @Id
    @Column(name = "curriculum_id")
    private String id;
    @Column(name = "major")
    private String major ;
    @Column(name = "version_name")
    private String versionName ;
    @Column(name = "effective_year")
    private int effectiveYear ;


}
