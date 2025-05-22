package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Service.MainService;
import org.example.subjectrecommender.Service.ScoreService;
import org.example.subjectrecommender.Service.UserService;
import org.example.subjectrecommender.config.ValueProperties;
import org.example.subjectrecommender.dto.SubjectRecommendDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/handle")
public class HandleController {
    MainService mainService;
    UserService userService;
    ValueProperties valueProperties;
    public HandleController(MainService mainService, UserService userService
    , ValueProperties valueProperties) {
        this.mainService = mainService;
        this.userService = userService;
        this.valueProperties = valueProperties;
    }
    @PostMapping("/algo")
    public void algo() throws IOException {
        String fileExport=valueProperties.getFileExport();
        String efimfile=valueProperties.getFileEFIM();
        int minUtility= valueProperties.getMinUtility();
        mainService.exportTransactionFile(fileExport);
        System.out.println("Hoàn thành exportFile");
        mainService.runEFIM(fileExport,efimfile,minUtility);
        System.out.println("Hoàn thành chạy EFIM");
        mainService.readAndSaveItemsets(efimfile);
        System.out.println("Hoàn thành lưu HUitemset vào cơ sở dữ liệu");

    }
    @GetMapping("/recommend")
    public ResponseEntity<List<SubjectRecommendDTO>> recomendSubject(@RequestParam int semester, @RequestParam String userId) throws IOException {
        User user=userService.getByID(userId);
        List<SubjectRecommendDTO> result=mainService.suggestSubjectsForUser(user,semester);
        if(result.size()>10){
            result=result.subList(0,10);
        }
        System.out.println("Số lượng môn học gợi ý: "+result.size());
       return ResponseEntity.ok().body(result);
    }
}
