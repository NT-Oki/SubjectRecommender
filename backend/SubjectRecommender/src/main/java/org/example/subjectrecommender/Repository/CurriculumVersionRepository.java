package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.CurriculumCourse;
import org.example.subjectrecommender.Model.CurriculumVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CurriculumVersionRepository extends JpaRepository<CurriculumVersion, String> {

}
