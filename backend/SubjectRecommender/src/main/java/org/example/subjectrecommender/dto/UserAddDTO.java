package org.example.subjectrecommender.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class UserAddDTO {
    private String userId;
    private String lastName;
    private String name;
    private int enrollmentYear;
    private String curriculumId;
    private int role;
}
