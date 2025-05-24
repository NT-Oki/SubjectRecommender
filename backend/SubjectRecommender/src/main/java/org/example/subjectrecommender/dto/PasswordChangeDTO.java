package org.example.subjectrecommender.dto;

import lombok.Data;

@Data
public class PasswordChangeDTO {
    private String userId;
    private String newPassWord;
}
