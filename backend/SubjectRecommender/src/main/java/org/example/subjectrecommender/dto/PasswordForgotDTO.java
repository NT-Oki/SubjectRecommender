package org.example.subjectrecommender.dto;

import lombok.Data;

@Data
public class PasswordForgotDTO {
    private String userId;
    private String email;

}
