package org.example.subjectrecommender;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;


@SpringBootApplication
@EntityScan(basePackages = "org.example.subjectrecommender.Model")
public class SubjectRecommenderApplication {

    public static void main(String[] args) {
        SpringApplication.run(SubjectRecommenderApplication.class, args);
    }

}
