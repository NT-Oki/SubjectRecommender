package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.CurriculumCourse;
import org.example.subjectrecommender.Repository.CurriculumCourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CurriculumCourseService {
    @Autowired
    CurriculumCourseRepository curriculumCourseRepository;

    public void save(CurriculumCourse curriculumCourse) {
        curriculumCourseRepository.save(curriculumCourse);
    }

}
