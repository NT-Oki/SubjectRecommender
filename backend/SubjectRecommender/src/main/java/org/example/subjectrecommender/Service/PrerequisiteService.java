package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.Prerequisite;
import org.example.subjectrecommender.Repository.PrerequisiteRepository;
import org.springframework.stereotype.Service;

@Service
public class PrerequisiteService {
    PrerequisiteRepository prerequisiteRepository;
    public PrerequisiteService(PrerequisiteRepository prerequisiteRepository) {
        this.prerequisiteRepository = prerequisiteRepository;
    }
    public void save(Prerequisite prerequisite) {
        prerequisiteRepository.save(prerequisite);
    }
}
