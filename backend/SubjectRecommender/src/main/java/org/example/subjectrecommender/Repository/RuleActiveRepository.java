package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.RuleActive;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RuleActiveRepository extends JpaRepository<RuleActive, Long> {
    List<RuleActive> findAllByOrderByUtilityDesc();
}
