package org.example.subjectrecommender.Repository;

import jakarta.transaction.Transactional;
import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    boolean existsById(String id);
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.password = :newPassword WHERE u.id = :id")
    int updatePasswordById(@Param("id") String id, @Param("newPassword") String newPassword);
    List<User> findByNameContainingOrLastNameContaining(String name, String lastname);
    @Query("SELECT u FROM User u " +
            "WHERE (:userId IS NULL OR u.id like :userId) " +
            "AND (:userName IS NULL OR " +
            "     LOWER(CONCAT(u.lastName, ' ', u.name)) LIKE LOWER(CONCAT('%', :userName, '%')) ) " +
            "AND (:year IS NULL OR u.enrollmentYear = :year) " )
    Page<User> findByFilters(@Param("userId") String userId,
                              @Param("userName") String userName,
                              @Param("year") Integer year,
                              Pageable pageable);

}


