package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.ResetToken;
import org.example.subjectrecommender.Repository.ResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class ResetTokenService {
    @Autowired
    ResetTokenRepository resetTokenRepository;
    public ResetToken findByToken(String token) {
        return resetTokenRepository.findResetTokenByToken(token);
    }
    public void save(ResetToken resetToken) {
        resetTokenRepository.save(resetToken);
    }
    public ResetToken create(String userId) {
        String token = UUID.randomUUID().toString().substring(0, 6);
        ResetToken resetToken = new ResetToken();
        resetToken.setUserId(userId);
        resetToken.setToken(token);
        resetToken.setExpiryTime(LocalDateTime.now().plusMinutes(30));
        return resetToken;
    }
    public void delete(Long id){
        resetTokenRepository.deleteById(id);
    }
}
