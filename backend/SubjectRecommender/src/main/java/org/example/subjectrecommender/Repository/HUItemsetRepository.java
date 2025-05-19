package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.HUItemset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HUItemsetRepository extends JpaRepository<HUItemset, Long> {
}
