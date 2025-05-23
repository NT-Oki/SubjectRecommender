package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.SubjectGroup;
import org.example.subjectrecommender.Repository.SubjectGroupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SubjectGroupService {
    @Autowired
    SubjectGroupRepository subjectGroupRepository;

    public SubjectGroup getById(String id) {
        return subjectGroupRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy SubjectGroup với ID: " + id));
    }

}
