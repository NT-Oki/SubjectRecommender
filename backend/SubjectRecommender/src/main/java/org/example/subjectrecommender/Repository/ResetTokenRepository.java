package org.example.subjectrecommender.Repository;

import org.example.subjectrecommender.Model.ResetToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ResetTokenRepository extends JpaRepository<ResetToken, Long> {
     ResetToken findResetTokenByToken(String token);

}
