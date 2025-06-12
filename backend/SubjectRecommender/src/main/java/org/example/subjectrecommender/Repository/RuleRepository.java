package org.example.subjectrecommender.Repository;

import jakarta.transaction.Transactional;
import org.example.subjectrecommender.Model.Rule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RuleRepository extends JpaRepository<Rule, Long> {
    List<Rule> findAllByOrderByUtilityDesc();
    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE rules", nativeQuery = true)
    void truncate();

}
