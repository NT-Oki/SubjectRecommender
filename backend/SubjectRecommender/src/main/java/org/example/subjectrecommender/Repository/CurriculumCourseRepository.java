package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.CurriculumCourse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CurriculumCourseRepository extends JpaRepository<CurriculumCourse, Integer> {
    public List<CurriculumCourse> findCurriculumCourseBySemester(int semester);
    public List <CurriculumCourse> findCurriculumCourseByCurriculum_Id(String curriculum_id);
    @Query("SELECT c FROM CurriculumCourse c " +
            "WHERE c.curriculum.id = :curriculum_id " +
            "AND (LOWER(c.subject.subjectName) LIKE LOWER(CONCAT('%', :subjectSearch, '%')) " +
            "OR LOWER(c.subject.id) LIKE LOWER(CONCAT('%', :subjectSearch, '%')))")
    List<CurriculumCourse> findCurriculumCourseFilter(@Param("curriculum_id") String curriculum_id,
                                                      @Param("subjectSearch") String subjectSearch);

}
