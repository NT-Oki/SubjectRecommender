package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.SubjectGroupRequirement;
import org.example.subjectrecommender.Repository.SubjectGroupRequirementRepository;
import org.example.subjectrecommender.dto.SubjectGroupRequirementDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubjectGroupRequirementService {
    @Autowired
    SubjectGroupRequirementRepository subjectGroupRequirementRepository;
    public List<SubjectGroupRequirement> getAllByCurriculumVersion(String curriculumVersionId) {
        return subjectGroupRequirementRepository.findByCurriculumVersionId(curriculumVersionId);
    }


}
