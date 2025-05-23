package org.example.subjectrecommender.Repository;

import jakarta.transaction.Transactional;
import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE Score s SET s.utility = :utility WHERE s.id = :id")
    void updateUtilityById(@Param("utility") float utility, @Param("id") Long id);
    public List<Score> findByUser(User user);

    List<Score> findByUserAndPassed(User user, int i);
    List<Score> findAllByUserId(String id);
    List<Score> findAllByUserIdAndPassed(String id, int i);
}
