package org.example.subjectrecommender.Model;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
@Table(name = "HUItemsets")
public class HUItemset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    @CollectionTable(name = "huitemset_items", joinColumns = @JoinColumn(name = "huitemset_id"))
    @Column(name = "item")
    private List<String> items;

    private float utility;


}
