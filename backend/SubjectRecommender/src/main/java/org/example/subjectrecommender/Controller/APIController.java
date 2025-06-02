package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Service.ScoreService;
import org.example.subjectrecommender.Service.UserService;
import org.example.subjectrecommender.dto.ScoreResponseDTO;
import org.example.subjectrecommender.dto.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class APIController {
    @Autowired
    ScoreService scoreService;
    @Autowired
    UserService userService;

    @GetMapping("/listScore")
    public ResponseEntity<Map<String, List<ScoreResponseDTO>>> listScore(@RequestParam String userId) {
        Map<String, List<ScoreResponseDTO>> result = scoreService.getGroupedScoresByUser(userId);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/info")
    public ResponseEntity<UserDTO> info(@RequestParam String userId) {
        UserDTO result=userService.getUserDTO(userId);
        return ResponseEntity.ok(result);
    }
}
