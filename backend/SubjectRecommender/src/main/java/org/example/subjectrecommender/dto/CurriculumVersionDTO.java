package org.example.subjectrecommender.dto;

import lombok.Data;
import org.example.subjectrecommender.Model.CurriculumVersion;

@Data
public class CurriculumVersionDTO {
    private String id;
    private String major ;
    private String versionName ;
    private int effectiveYear ;
    public CurriculumVersionDTO(CurriculumVersion curriculumVersion) {
        this.id = curriculumVersion.getId();
        this.major = curriculumVersion.getMajor();
        this.versionName = curriculumVersion.getVersionName();
        this.effectiveYear = curriculumVersion.getEffectiveYear();
    }
}
