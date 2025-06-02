package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.dto.ScoreAdminDto;
import org.example.subjectrecommender.dto.ScoreResponseDTO;
import org.example.subjectrecommender.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {
    @Autowired
    ScoreService scoreService;
    @Autowired
    UserService userService;
    public List<ScoreAdminDto> getAllScore() {
        return scoreService.getAll();
    }
    public List<UserDTO> getAllUser() {
        return userService.getUserDTOList();
    }



}
