package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.Prerequisite;
import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Repository.PrerequisiteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PrerequisiteService {
    PrerequisiteRepository prerequisiteRepository;
    public PrerequisiteService(PrerequisiteRepository prerequisiteRepository) {
        this.prerequisiteRepository = prerequisiteRepository;
    }
    public void save(Prerequisite prerequisite) {
        prerequisiteRepository.save(prerequisite);
    }
    public List<Prerequisite> findPrerequisiteListBySubject(Subject subject) {
        return prerequisiteRepository.findBySubject(subject);
    }
}
