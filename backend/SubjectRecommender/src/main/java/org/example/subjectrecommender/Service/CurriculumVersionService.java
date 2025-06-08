package org.example.subjectrecommender.Service;

import jakarta.transaction.Transactional;
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
    public void create (CurriculumVersion curriculumVersion) {
        CurriculumVersion version=new CurriculumVersion();
        version.setId("a");
        version.setVersionName("K46");
        version.setMajor("Công nghệ thông tin");
        version.setEffectiveYear(2025);
        version.setStatus(1);
        repository.save(curriculumVersion);
    }

}
