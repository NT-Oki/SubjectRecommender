package org.example.subjectrecommender.Repository;

import jakarta.transaction.Transactional;
import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long>, JpaSpecificationExecutor<Score> {
    @Modifying
    @Transactional
    @Query("UPDATE Score s SET s.utility = :utility WHERE s.id = :id")
    void updateUtilityById(@Param("utility") float utility, @Param("id") Long id);
    public List<Score> findByUser(User user);

    List<Score> findByUserIdAndPassed(String userId, int i);
    List<Score> findAllByUserId(String id);
    List<Score> findAllByUserIdAndPassed(String id, int i);
    Page<Score> findAll(Pageable pageable);
    @Query("SELECT s FROM Score s " +
            "WHERE (:userId IS NULL OR s.user.id like :userId) " +
            "AND (:subjectName IS NULL OR " +
            "     s.subject.id = :subjectName OR " +
            "     LOWER(s.subject.subjectName) LIKE LOWER(CONCAT('%', :subjectName, '%'))) " +
            "AND (:semester IS NULL OR s.semester = :semester) " +
            "AND (:status IS NULL OR s.passed = :status)")
    Page<Score> findByFilters(@Param("userId") String userId,
                              @Param("subjectName") String subjectName,
                              @Param("semester") Integer semester,
                              @Param("status") Integer status,
                              Pageable pageable);
    Score findBySubjectIdAndUserIdAndSemesterAndYear(String subjectId, String userId, Integer semester, Integer year);
}
