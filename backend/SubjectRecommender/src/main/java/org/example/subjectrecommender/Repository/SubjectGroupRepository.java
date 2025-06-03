package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.SubjectGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectGroupRepository extends JpaRepository<SubjectGroup, String> {


}
