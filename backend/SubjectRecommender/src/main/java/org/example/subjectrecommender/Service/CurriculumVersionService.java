package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.CurriculumVersion;
import org.example.subjectrecommender.Repository.CurriculumVersionRepository;
import org.springframework.stereotype.Service;

@Service
public class CurriculumVersionService {
    CurriculumVersionRepository repository;
    public CurriculumVersionService(CurriculumVersionRepository repository) {
        this.repository = repository;
    }
    public CurriculumVersion getById(String id) {
        return repository.getReferenceById(id);
    }
}
