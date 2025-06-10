package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.Rule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RuleRepository extends JpaRepository<Rule, Long> {
    List<Rule> findAllByOrderByUtilityDesc();
}
