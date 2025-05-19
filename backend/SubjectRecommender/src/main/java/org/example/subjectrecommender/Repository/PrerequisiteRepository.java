package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.Prerequisite;
import org.example.subjectrecommender.Model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PrerequisiteRepository extends JpaRepository<Prerequisite, Long> {
    public List<Prerequisite> findBySubject(Subject subject);
}
