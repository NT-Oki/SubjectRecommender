package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Service.MainService;
import org.example.subjectrecommender.Service.UserService;
import org.example.subjectrecommender.config.ValueProperties;
import org.example.subjectrecommender.dto.SubjectGroupRequirementDTO;
import org.example.subjectrecommender.dto.SubjectRecommendDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.*;

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
                                             @RequestParam(defaultValue = "1") int size) throws IOException {
        List<SubjectGroupRequirementDTO> subjectGroupRequirementDTOs=mainService.getAllSubjectGroupRequirments(userId);
        List<SubjectRecommendDTO> subjectRecommendDTOS=mainService.suggestSubjectsForUser(userId,semester);
        Map<String, List<SubjectRecommendDTO>> groupedSuggestions = mainService.sortBy(subjectRecommendDTOS);
        List<String> allKeys = new ArrayList<>(groupedSuggestions.keySet());
        int totalKeys = allKeys.size();
        int start = page * size;
        int end = Math.min(start + size, totalKeys);
        List<String> pagedKeys = new ArrayList<>();
        if (start < end) {
            pagedKeys = allKeys.subList(start, end);
        }
        Map<String, List<SubjectRecommendDTO>> pagedGroupedSuggestions = new LinkedHashMap<>(); // <-- Thay đổi ở đây
        for (String key : pagedKeys) {
            pagedGroupedSuggestions.put(key, groupedSuggestions.get(key));
        }
        int totalSubjectRecommendDTOs = groupedSuggestions.values().stream()
                .mapToInt(List::size) // Chuyển mỗi List thành kích thước của nó
                .sum();
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("subjectList", pagedGroupedSuggestions);
        response.put("learnedSubjects", subjectGroupRequirementDTOs);
        response.put("total", totalKeys);
        response.put("page", page);
        response.put("size", size);
        response.put("totalItem", totalSubjectRecommendDTOs);
       return ResponseEntity.ok().body(response);
    }
}
