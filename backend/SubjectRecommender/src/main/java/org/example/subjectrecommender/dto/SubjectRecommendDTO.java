package org.example.subjectrecommender.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.example.subjectrecommender.Model.Subject;

@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SubjectRecommendDTO {
    @EqualsAndHashCode.Include
    private Subject subject;
    private float utility;
}
