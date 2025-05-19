package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.HUItemset;
import org.example.subjectrecommender.Repository.HUItemsetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HUItemsetService {
    HUItemsetRepository HUItemsetRepository;
    public HUItemsetService(HUItemsetRepository HUItemsetRepository) {
        this.HUItemsetRepository = HUItemsetRepository;
    }
    public void saveAll(List<HUItemset> HUItemsets) {
        HUItemsetRepository.saveAll(HUItemsets);
    }
}
