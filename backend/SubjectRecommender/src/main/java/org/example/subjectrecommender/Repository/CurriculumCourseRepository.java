package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.CurriculumCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurriculumCourseRepository extends JpaRepository<CurriculumCourse, Integer> {

}
