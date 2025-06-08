package org.example.subjectrecommender.Service;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.CellRangeAddress;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.subjectrecommender.Model.CurriculumCourse;
import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Repository.CurriculumCourseRepository;
import org.example.subjectrecommender.Repository.PrerequisiteRepository;
import org.example.subjectrecommender.dto.CurriculumCourseDTO;
import org.example.subjectrecommender.dto.ScoreAdminDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;

@Service
public class CurriculumCourseService {
    @Autowired
    CurriculumCourseRepository curriculumCourseRepository;
    @Autowired
    PrerequisiteRepository prerequisiteRepository;

    public void save(CurriculumCourse curriculumCourse) {
        curriculumCourseRepository.save(curriculumCourse);
    }
    public Map<String, List<CurriculumCourseDTO>> findAlLGroupByCurriculumId(String curriculumId, String subjectSeach) {
        List<CurriculumCourse> curriculumCourseList = new ArrayList<>();
        if(subjectSeach==null||subjectSeach.trim().isEmpty()){
            curriculumCourseList = curriculumCourseRepository.findCurriculumCourseByCurriculum_Id(curriculumId);
        }else{
            curriculumCourseList=curriculumCourseRepository.findCurriculumCourseFilter(curriculumId,subjectSeach);
        }
        Map<String, List<CurriculumCourseDTO>> result = new TreeMap<>(new Comparator<String>() {
            @Override
            public int compare(String o1, String o2) {
                //Học kỳ 1 - Năm 1
                String[] value1 = o1.split("-");
                String[] value2 = o2.split("-");
                int year1 = Integer.parseInt(value1[1].replace("Năm","").trim());
                int year2 = Integer.parseInt(value2[1].replace("Năm","").trim());
                if(year1!=year2){
                    return year1-year2;
                }
                int semester1= Integer.parseInt(value1[0].replace("Học kỳ","").trim());
                int semester2= Integer.parseInt(value2[0].replace("Học kỳ","").trim());
                    return semester1-semester2;
            }
        });
        for(CurriculumCourse curriculumCourse:curriculumCourseList){
            List<Subject> preSubjects= prerequisiteRepository.getPreSubjectBySubjectId(curriculumCourse.getSubject().getId());
            CurriculumCourseDTO curriculumCourseDTO = new CurriculumCourseDTO(curriculumCourse,preSubjects);
                String key = "Học kỳ "+curriculumCourse.getSemester()+" - "+"Năm "+curriculumCourse.getYear();
                if(!result.containsKey(key)){
                    result.put(key, new ArrayList<CurriculumCourseDTO>());
                }
                result.get(key).add(curriculumCourseDTO);
        }
        return result;
    }
    public ByteArrayInputStream export(String curriculumId, String subjectSeach ) throws IOException {
        Map<String, List<CurriculumCourseDTO>> curriculumList = findAlLGroupByCurriculumId(curriculumId, subjectSeach);
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("curriculum_"+curriculumId);

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("STT");
            header.createCell(1).setCellValue("Mã môn học");
            header.createCell(2).setCellValue("Tên môn học");
            header.createCell(3).setCellValue("Chuyên ngành");
            header.createCell(4).setCellValue("Số tín chỉ");
            header.createCell(5).setCellValue("Môn tiên quyết");
            header.createCell(6).setCellValue("Nhóm môn học");

            int rowIdx = 1;
            for (Map.Entry<String, List<CurriculumCourseDTO>> entry : curriculumList.entrySet()) {
                Row rowKey = sheet.createRow(rowIdx++);
                rowKey.createCell(0).setCellValue(entry.getKey());
                sheet.addMergedRegion(new CellRangeAddress(rowIdx - 1, rowIdx - 1, 0, 6));
                List<CurriculumCourseDTO> curriculumCourseDTOList = entry.getValue();
                for (CurriculumCourseDTO dto : curriculumCourseDTOList) {
                    String preSubject = "";
                    for (Subject s : dto.getSubject().getPreSubject()) {
                        preSubject += " ";
                        preSubject += s.getId();

                    }
                    Row row = sheet.createRow(rowIdx++);
                    row.createCell(0).setCellValue(rowIdx - 2);
                    row.createCell(1).setCellValue(dto.getSubject().getSubject().getId());
                    row.createCell(2).setCellValue(dto.getSubject().getSubject().getSubjectName());
                    row.createCell(3).setCellValue(dto.getCurriculum().getMajor());
                    row.createCell(4).setCellValue(dto.getSubject().getSubject().getCredit());
                    row.createCell(5).setCellValue(preSubject);
                    row.createCell(6).setCellValue(dto.getSubject().getSubject().getSubjectGroup().getId());
                }
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }



}
