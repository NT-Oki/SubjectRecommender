package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.Prerequisite;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrerequisiteRepository extends JpaRepository<Prerequisite, Long> {
}
