package org.example.subjectrecommender.dto;

import lombok.Data;

@Data
public class UserImportDTO {
    private String fileId;
    private int role;
    private String curriculumVersion;
}
