package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
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
    public Page<ScoreAdminDto> getAllScoreResponse(String userId, String subjectName, Integer semester, String status, Pageable pageable) {
        return scoreService.getAllScorePageWithFilterUsingQuery(userId,subjectName,semester,status,pageable);

    }
    public ByteArrayInputStream exportScoreToExcel(List<ScoreAdminDto> scores) throws IOException {
        return scoreService.exportScoreToExcel(scores);
    }
    public Page<UserDTO> getAllUserResponse(String userId, String userName, Integer year, Pageable pageable) {
        return userService.getUserDtoFilter(userId,userName,year,pageable);

    }
    public ByteArrayInputStream exportUserToExcel(List<UserDTO> users) throws IOException {
        return userService.exportUserToExcel(users);
    }

    public void updateScore(ScoreUpdateDTO dto) {
         scoreService.updateScore(dto);
    }

    public void updateUser(UserUpdateDTO dto) {
        userService.updateUser(dto);
    }

    public void addScore(ScoreAdd dto) {
        scoreService.addScore(dto);
    }
}
