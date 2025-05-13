package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.CurriculumCourse;
import org.example.subjectrecommender.Repository.CurriculumCourseRepository;
import org.springframework.stereotype.Service;

@Service
public class CurriculumCourseService {
    CurriculumCourseRepository curriculumCourseRepository;
    public CurriculumCourseService(CurriculumCourseRepository curriculumCourseRepository) {
        this.curriculumCourseRepository = curriculumCourseRepository;
    }
    public void save(CurriculumCourse curriculumCourse) {
        curriculumCourseRepository.save(curriculumCourse);
    }
}
