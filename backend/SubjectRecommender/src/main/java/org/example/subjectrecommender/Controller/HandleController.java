package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Service.MainService;
import org.example.subjectrecommender.Service.ScoreService;
import org.example.subjectrecommender.Service.UserService;
import org.example.subjectrecommender.config.ValueProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
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
    @PostMapping("/recomend")
    public ResponseEntity<List<Subject>> recomendSubject( @RequestParam int semester) throws IOException {
        // Lấy userID từ token (SecurityContext)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userID = (String) auth.getPrincipal();
        User user=userService.getByID(userID);
        List<Subject> sugest=mainService.suggestSubjectsForUser(user,semester);
        for(Subject subject:sugest){
            System.out.println(subject);
        }
        System.out.println("Số lượng môn học gợi ý: "+sugest.size());
       return ResponseEntity.ok().body(sugest);
    }
}
