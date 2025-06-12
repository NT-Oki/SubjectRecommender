package org.example.subjectrecommender.Repository;

import jakarta.transaction.Transactional;
import org.example.subjectrecommender.Model.RuleActive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RuleActiveRepository extends JpaRepository<RuleActive, Long> {
    List<RuleActive> findAllByOrderByUtilityDesc();
    @Modifying
    @Transactional
    @Query(value = "TRUNCATE TABLE rule_actives", nativeQuery = true)
    void truncate();
}
