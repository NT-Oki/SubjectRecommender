package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Service.MainService;
import org.example.subjectrecommender.Service.ScoreService;
import org.example.subjectrecommender.Service.UserService;
import org.example.subjectrecommender.config.ValueProperties;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
public class HandleController {
    ScoreService scoreService;
    MainService mainService;
    UserService userService;
    ValueProperties valueProperties;
    public HandleController(ScoreService scoreService,MainService mainService, UserService userService
    , ValueProperties valueProperties) {
        this.scoreService = scoreService;
        this.mainService = mainService;
        this.userService = userService;
        this.valueProperties = valueProperties;
    }
    @PostMapping("/export")
    public void export() throws IOException {
        scoreService.exportTransactionFile("D:\\7.Test\\tieuluan\\export.txt");

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
    public ResponseEntity<List<Subject>> recomendSubject(@RequestParam String userID, @RequestParam int semester) throws IOException {

      //  mainService.readAndSaveItemsets("D:\\7.Test\\tieuluan\\al.txt");
        User user=userService.getByID(userID);
        List<Subject> sugest=mainService.suggestSubjectsForUser(user,semester);
        for(Subject subject:sugest){
            System.out.println(subject);
        }
        System.out.println("Số lượng môn học gợi ý: "+sugest.size());
       return ResponseEntity.ok().body(sugest);
    }
}
