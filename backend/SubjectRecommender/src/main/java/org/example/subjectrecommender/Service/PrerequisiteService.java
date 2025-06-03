package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.Prerequisite;
import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Repository.PrerequisiteRepository;
import org.example.subjectrecommender.Repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class PrerequisiteService {
    @Autowired
    PrerequisiteRepository prerequisiteRepository;
    public void save(Prerequisite prerequisite) {
        prerequisiteRepository.save(prerequisite);
    }
    public List<Prerequisite> findPrerequisiteListBySubject(Subject subject) {
        return prerequisiteRepository.findBySubject(subject);
    }
    public List<Subject> getAllPrerequisiteSubjectsBySubjectId(String subjectId) {
        List<Subject> subjectList = new ArrayList<>();
        for (Prerequisite p: prerequisiteRepository.findBySubjectId(subjectId)) {
            subjectList.add(p.getPrerequisiteSubject());
        }
        return subjectList;
    }
}
