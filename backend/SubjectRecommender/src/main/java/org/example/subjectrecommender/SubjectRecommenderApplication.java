package org.example.subjectrecommender;

import org.example.subjectrecommender.Model.CurriculumVersion;
import org.example.subjectrecommender.Service.CurriculumVersionService;
import org.example.subjectrecommender.Service.MainService;
import org.example.subjectrecommender.Service.UserService;
import org.example.subjectrecommender.database.ImportData;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;
import org.springframework.scheduling.annotation.EnableAsync;

import java.io.IOException;

@EnableAsync
@SpringBootApplication
@EntityScan(basePackages = "org.example.subjectrecommender.Model")
public class SubjectRecommenderApplication {

    public static void main(String[] args) throws IOException {
      ApplicationContext context=  SpringApplication.run(SubjectRecommenderApplication.class, args);
//        int updated=userService.updatePasswordByNameorLastName("Đ", "đ");
//        System.out.println(updated);
//        ImportData importData= context.getBean(ImportData.class);
//        importData.updateCurriculumVersionForUser("7480201_2020");
//        importData.updateRoleForUser(2);//student
//        MainService mainService= context.getBean(MainService.class);
//        mainService.exportTransactionFile();
//            mainService.runEFIM();
//        mainService.readAndSaveRules();
//        mainService.transFromRuleToRuleActive();
    }

}
