package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Service.MainService;
import org.example.subjectrecommender.Service.ScoreService;
import org.example.subjectrecommender.Service.UserService;
import org.example.subjectrecommender.util.Algorithm;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class HandleController {
    ScoreService scoreService;
    Algorithm algorithm;
    MainService mainService;
    UserService userService;
    public HandleController(ScoreService scoreService,MainService mainService, UserService userService) {
        this.scoreService = scoreService;
        this.algorithm = new Algorithm();
        this.mainService = mainService;
        this.userService = userService;
    }
    @PostMapping("/export")
    public void export() throws IOException {
        scoreService.exportTransactionFile("D:\\7.Test\\tieuluan\\export.txt");

    }
    @PostMapping("/al")
    public void al() throws IOException {
        //algorithm.validateInputFile("D:\\7.Test\\tieuluan\\export.txt");
        algorithm.runEFIM("D:\\7.Test\\tieuluan\\export.txt","D:\\7.Test\\tieuluan\\al.txt",100000 );

    }
    @PostMapping("/read")
    public void read() throws IOException {
        //algorithm.validateInputFile("D:\\7.Test\\tieuluan\\export.txt");
//        algorithm.readItemsets("D:\\7.Test\\tieuluan\\al.txt");
        User user=userService.getByID("00000020");
        mainService.suggestSubjectsForUser(user,"D:\\7.Test\\tieuluan\\al.txt");

    }
}
