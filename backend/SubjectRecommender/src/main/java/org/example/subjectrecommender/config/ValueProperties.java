package org.example.subjectrecommender.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "value")
@Data
public class ValueProperties {
   private String fileExportTransaction;
   private String fileAlgoHUSRM;
   private boolean filterPassedSubjects;
   private int minUtility;
   private String secret_key;
   private int time_token;
   private String email;

}
