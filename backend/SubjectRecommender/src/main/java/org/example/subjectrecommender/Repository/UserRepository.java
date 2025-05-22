package org.example.subjectrecommender.Repository;

import jakarta.transaction.Transactional;
import org.example.subjectrecommender.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsById(String id);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :newPassword WHERE u.id = :id")
    int updatePasswordById(@Param("id") String id, @Param("newPassword") String newPassword);

}
