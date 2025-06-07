package org.example.subjectrecommender.dto;

import lombok.Data;
import org.example.subjectrecommender.Model.Subject;

import java.util.List;

@Data
public class SubjectDTO {
    private Subject subject;
    private List<Subject> preSubject;
    public SubjectDTO(Subject subject, List<Subject> preSubject) {
        this.subject = subject;
        this.preSubject = preSubject;
    }



}
