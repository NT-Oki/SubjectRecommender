package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Service.MainService;
import org.example.subjectrecommender.Service.ScoreService;
import org.example.subjectrecommender.Service.UserService;
import org.example.subjectrecommender.config.ValueProperties;
import org.example.subjectrecommender.dto.SubjectGroupRequirementDTO;
import org.example.subjectrecommender.dto.SubjectRecommendDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/handle")
public class HandleController {
    @Autowired
    MainService mainService;
    @Autowired
    UserService userService;
    @Autowired
    ValueProperties valueProperties;

    @PostMapping("/algo")
    public void algo() throws IOException {
        mainService.exportTransactionFile();
        mainService.runEFIM();
        mainService.readAndSaveRules();
    }
    @GetMapping("/recommend")
    public ResponseEntity<?> recomendSubject(@RequestParam int semester, @RequestParam String userId, @RequestParam(defaultValue = "0") int page,
                                             @RequestParam(defaultValue = "10") int size) throws IOException {
//        User user=userService.getByID(userId);
        Pageable pageable = PageRequest.of(page,size);
        Page<SubjectRecommendDTO> subjectRecommendDTOs=mainService.suggestSubjectsForUser(userId,semester,pageable);
//        if(result.size()>10){
//            result=result.subList(0,10);
//        }
        List<SubjectRecommendDTO> recommendDTOS=subjectRecommendDTOs.getContent();
        List<SubjectGroupRequirementDTO> subjectGroupRequirementDTOs=mainService.getAllSubjectGroupRequirments(userId);
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("subjectList", recommendDTOS);
        response.put("learnedSubjects", subjectGroupRequirementDTOs);
        response.put("total", (int)subjectRecommendDTOs.getTotalElements());
        response.put("page", subjectRecommendDTOs.getNumber());
        response.put("size", subjectRecommendDTOs.getSize());
       return ResponseEntity.ok().body(response);
    }
}
