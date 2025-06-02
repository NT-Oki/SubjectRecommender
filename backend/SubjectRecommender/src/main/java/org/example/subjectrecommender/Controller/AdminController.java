package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Service.AdminService;
import org.example.subjectrecommender.Service.MainService;
import org.example.subjectrecommender.dto.ScoreAdminDto;
import org.example.subjectrecommender.dto.ScoreResponseDTO;
import org.example.subjectrecommender.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {
    @Autowired
    AdminService adminService;
    @GetMapping("/scores")
    public ResponseEntity<?> scoreList(){
        List<ScoreAdminDto> responseDTOList= adminService.getAllScore();

        return ResponseEntity.ok(responseDTOList.subList(0,10));

    }
    @GetMapping("/students")
    public ResponseEntity<?> studentList(){
        List<UserDTO> responseDTOList= adminService.getAllUser();
        return ResponseEntity.ok(responseDTOList.subList(0,10));

    }
}
