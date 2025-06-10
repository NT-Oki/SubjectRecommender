package org.example.subjectrecommender.Model;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@NoArgsConstructor
@Table(name = "rule_actives")
public class RuleActive{
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
    public RuleActive(Rule rule) {
    this.antecedentItems = rule.getAntecedentItems();
    this.consequentItems = rule.getConsequentItems();
    this.support = rule.getSupport();
    this.confidence = rule.getConfidence();
    this.utility = rule.getUtility();

    }
}
