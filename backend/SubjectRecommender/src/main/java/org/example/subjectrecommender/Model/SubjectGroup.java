package org.example.subjectrecommender.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Data
@Table(name = "subjectgroups")
public class SubjectGroup {
    @Id
    @Column(name = "id")
    private String id;
    @Column(name = "group_name")
    private String groupName;

}
