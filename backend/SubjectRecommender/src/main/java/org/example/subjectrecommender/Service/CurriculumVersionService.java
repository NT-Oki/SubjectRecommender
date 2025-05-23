package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.CurriculumVersion;
import org.example.subjectrecommender.Repository.CurriculumVersionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CurriculumVersionService {
    @Autowired
    CurriculumVersionRepository repository;

    public CurriculumVersion getById(String id) {
        return repository.getReferenceById(id);
    }
}
