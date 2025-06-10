package org.example.subjectrecommender.Model;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Data
@Table(name = "rules")
public class Rule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "antecedent_items")
    private String antecedentItems;
    @Column(name = "consequent_item")
    private String consequentItems;
    @Column(name = "support")
    BigDecimal support;
    @Column(name = "confidence")
    BigDecimal confidence;
    @Column(name = "utility")
    BigDecimal utility;
}
