package org.example.subjectrecommender;

import org.example.subjectrecommender.Model.CurriculumVersion;
import org.example.subjectrecommender.Service.CurriculumVersionService;
import org.example.subjectrecommender.Service.UserService;
import org.example.subjectrecommender.database.ImportData;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.ApplicationContext;


@SpringBootApplication
@EntityScan(basePackages = "org.example.subjectrecommender.Model")
public class SubjectRecommenderApplication {

    public static void main(String[] args) {
      ApplicationContext context=  SpringApplication.run(SubjectRecommenderApplication.class, args);
//        UserService userService = context.getBean(UserService.class);
//        int updated=userService.updatePasswordByNameorLastName("Đ", "đ");
//        System.out.println(updated);
//        ImportData importData= context.getBean(ImportData.class);
//        importData.updateCurriculumVersionForUser("7480201_2020");
//        importData.updateRoleForUser(2);//student



    }

}
