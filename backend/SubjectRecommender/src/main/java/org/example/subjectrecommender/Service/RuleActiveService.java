package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.RuleActive;
import org.example.subjectrecommender.Repository.RuleActiveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RuleActiveService {
    @Autowired
    RuleActiveRepository ruleActiveRepository;
    public Page<RuleActive> getRuleActiveByUtilityDesc(Pageable pageable) {
        return ruleActiveRepository.findAllByOrderByUtilityDesc(pageable);
    }
}
