package org.example.subjectrecommender.dto;

import lombok.Data;
import org.example.subjectrecommender.Model.SubjectGroup;

@Data
public class SubjectGroupRequirementDTO {
    private SubjectGroup subjectGroup;
    private int requirementCredit;
    private int learnedCredit;
}
