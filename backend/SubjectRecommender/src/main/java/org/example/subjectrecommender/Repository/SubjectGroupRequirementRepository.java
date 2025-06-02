package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.SubjectGroupRequirement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectGroupRequirementRepository extends JpaRepository<SubjectGroupRequirement, Long> {
    List<SubjectGroupRequirement> findByCurriculumVersionId(String id);
}
