package org.example.subjectrecommender.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.example.subjectrecommender.Model.Subject;

import java.util.List;

@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SubjectRecommendDTO {
    @EqualsAndHashCode.Include
    private Subject subject;// đem so sánh, để tránh gợi ý trùng
    private float utility;
    private List<Subject> preSubjects;//môn học tiên quyết

}
