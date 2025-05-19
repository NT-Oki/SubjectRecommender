package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.CurriculumCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CurriculumCourseRepository extends JpaRepository<CurriculumCourse, Integer> {
    public List<CurriculumCourse> findCurriculumCourseBySemester(int semester);

}
