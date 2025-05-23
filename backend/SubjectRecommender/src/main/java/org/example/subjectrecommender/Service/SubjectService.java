package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

@Service
public class SubjectService {
    @Autowired
    SubjectRepository subjectRepository;

    public void save(Subject subject) {
        subjectRepository.save(subject);
    }
    public Subject getSubjectById(String id) {
        return subjectRepository.findById(id).orElse(null); // Trả về null nếu không tồn tại
    }



}
