package org.example.subjectrecommender.dto;

import jakarta.persistence.Column;
import lombok.Data;
import org.example.subjectrecommender.Model.User;

@Data
public class UserDTO {
    private String id;
    private String lastName;
    private String name;
    private String major;
    private int enrollmesntYear;
    public UserDTO(User user) {
        this.id = user.getId();
        this.lastName = user.getLastName();
        this.name = user.getName();
        this.major = user.getMajor();
        this.enrollmesntYear = user.getEnrollmentYear();
    }

}
