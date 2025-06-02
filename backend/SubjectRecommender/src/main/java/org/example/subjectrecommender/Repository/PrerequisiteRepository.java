package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.Prerequisite;
import org.example.subjectrecommender.Model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface PrerequisiteRepository extends JpaRepository<Prerequisite, Long> {
    public List<Prerequisite> findBySubject(Subject subject);
    public List<Prerequisite> findBySubjectId(String id);
}
