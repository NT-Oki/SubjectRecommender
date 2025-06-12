package org.example.subjectrecommender.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.example.subjectrecommender.Model.Subject;

import java.math.BigDecimal;
import java.util.List;

@Data
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class SubjectRecommendDTO {
    @EqualsAndHashCode.Include
    private Subject subject;// đem so sánh, để tránh gợi ý trùng
    private BigDecimal utility;
    private List<Subject> preSubjects;//môn học tiên quyết
    private BigDecimal support;
    private BigDecimal confidence;
    private int semester;
    private int year;
}
