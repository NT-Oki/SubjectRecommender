package org.example.subjectrecommender.Service;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.subjectrecommender.Model.RuleActive;
import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Repository.RuleActiveRepository;
import org.example.subjectrecommender.dto.CurriculumCourseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class RuleActiveService {
    @Autowired
    RuleActiveRepository ruleActiveRepository;
    public Page<RuleActive> getRuleActiveByUtilityDesc(Pageable pageable) {
        return ruleActiveRepository.findAllByOrderByUtilityDesc(pageable);
    }
    public ByteArrayInputStream export( ) throws IOException {
        List<RuleActive> ruleActiveList = ruleActiveRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("ruleActive");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("STT");
            header.createCell(0).setCellValue("ID");
            header.createCell(1).setCellValue("AntecedentItems");
            header.createCell(2).setCellValue("ConsequentItems");
            header.createCell(3).setCellValue("Support");
            header.createCell(4).setCellValue("Confidence");
            header.createCell(5).setCellValue("Utility");

            int rowIdx = 1;
            for (RuleActive rule : ruleActiveList) {
                    Row row = sheet.createRow(rowIdx++);
                    row.createCell(0).setCellValue(rowIdx - 1);
                    row.createCell(1).setCellValue(rule.getId());
                    row.createCell(2).setCellValue(rule.getAntecedentItems());
                    row.createCell(3).setCellValue(rule.getConsequentItems());
                    row.createCell(4).setCellValue(rule.getSupport().toString());
                    row.createCell(5).setCellValue(rule.getConfidence().toString());
                    row.createCell(6).setCellValue(rule.getUtility().toString());
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
