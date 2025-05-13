package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.SubjectGroup;
import org.example.subjectrecommender.Repository.SubjectGroupRepository;
import org.springframework.stereotype.Service;

@Service
public class SubjectGroupService {
    SubjectGroupRepository subjectGroupRepository;
    public SubjectGroupService(SubjectGroupRepository subjectGroupRepository) {
        this.subjectGroupRepository = subjectGroupRepository;
    }
    public SubjectGroup getById(String id) {
        return subjectGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy SubjectGroup với ID: " + id));
    }

}
