package org.example.subjectrecommender.dto;

import lombok.Data;
import org.example.subjectrecommender.Model.CurriculumCourse;
import org.example.subjectrecommender.Model.CurriculumVersion;
import org.example.subjectrecommender.Model.Subject;

import java.util.List;

@Data
public class CurriculumCourseDTO {
    private Long id;
    private CurriculumVersionDTO curriculum;
    private SubjectDTO subject;
    private int semester;
    private int year;
    private int required;
    public CurriculumCourseDTO(CurriculumCourse curriculumCourse, List<Subject> preSubjects) {
        this.id = curriculumCourse.getId();
        this.curriculum=new CurriculumVersionDTO(curriculumCourse.getCurriculum());
        this.subject=new SubjectDTO(curriculumCourse.getSubject(), preSubjects);
        this.semester=curriculumCourse.getSemester();
        this.year=curriculumCourse.getYear();
        this.required=curriculumCourse.getRequired();
    }
}
