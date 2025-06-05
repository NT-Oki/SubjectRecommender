package org.example.subjectrecommender.Service;

import ch.qos.logback.core.pattern.Converter;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.subjectrecommender.Model.Prerequisite;
import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.User;
import org.example.subjectrecommender.Repository.PrerequisiteRepository;
import org.example.subjectrecommender.Repository.ScoreRepository;
import org.example.subjectrecommender.Repository.SubjectRepository;
import org.example.subjectrecommender.Repository.UserRepository;
import org.example.subjectrecommender.dto.ScoreAdd;
import org.example.subjectrecommender.dto.ScoreAdminDto;
import org.example.subjectrecommender.dto.ScoreResponseDTO;
import org.example.subjectrecommender.dto.ScoreUpdateDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

    @Service
    public class ScoreService {
        @Autowired
        ScoreRepository scoreRepository;
        @Autowired
        PrerequisiteService prerequisiteService;
        @Autowired
        UserRepository userRepository;
        @Autowired
        SubjectRepository subjectRepository;
        public void save (Score score) {
            scoreRepository.save(score);
        }
    //    public void update(String col){
    //        scoreRepository.updateByIdAnd()
    //    }
    @Transactional
    public void updateAllUtility() {
        List<Score> scores = scoreRepository.findAll();
        for (Score score : scores) {
            if (score.getSubject() != null ) {
                score.setUtility(score.getScore() * score.getSubject().getCredit());
            } else {
                score.setUtility(0);
            }
        }
        scoreRepository.saveAll(scores);
    }

public Map<String, List<ScoreResponseDTO>> getGroupedScoresByUser(String userId) {
    List<Score> scores = scoreRepository.findAllByUserId(userId);
    Map<String, List<ScoreResponseDTO>> result = new TreeMap<String, List<ScoreResponseDTO>>(new Comparator<String>() {
        @Override
        public int compare(String o1, String o2) {//sắp xếp ngược
            String[] parts1 = o1.split(" - ");
            String[] parts2 = o2.split(" - ");

            int year1 = Integer.parseInt(parts1[1].replace("Năm học ", "").trim());
            int year2 = Integer.parseInt(parts2[1].replace("Năm học ", "").trim());

            if (year1 != year2) {
                return year2 - year1;
            }

            int semester1 = Integer.parseInt(parts1[0].replace("Học kỳ ", "").trim());
            int semester2 = Integer.parseInt(parts2[0].replace("Học kỳ ", "").trim());

            return semester2 - semester1;
        }
    });

    for (Score score : scores) {
        List<Subject> preSubjects = prerequisiteService.getAllPrerequisiteSubjectsBySubjectId(score.getSubject().getId());
        ScoreResponseDTO dto = new ScoreResponseDTO(score, preSubjects);

        String key = "Học kỳ " + dto.getSemester() + " - Năm học " + dto.getYear() + " - " + (dto.getYear() + 1);
        if (!result.containsKey(key)) {
            result.put(key, new ArrayList<ScoreResponseDTO>());
        }
        result.get(key).add(dto);
    }

    return result;
}
//Cho admin
public List<ScoreAdminDto> getAll(){
            List<Score> scoreList= scoreRepository.findAll();
            List<ScoreAdminDto> scoreResponseDTOList= new ArrayList<>();
            for(Score score : scoreList){
                List<Subject> preSubjects = prerequisiteService.getAllPrerequisiteSubjectsBySubjectId(score.getSubject().getId());
                ScoreAdminDto dto = new ScoreAdminDto(score, preSubjects);
                scoreResponseDTOList.add(dto);
            }
            return scoreResponseDTOList;
}
//cho admin
public Page<ScoreAdminDto> getAllScorePageWithFilterUsingQuery(
        String userId, String subjectName, Integer semester, String status, Pageable pageable) {
    Integer passed = null;
    if ("1".equalsIgnoreCase(status)) passed = 1;
    else if ("0".equalsIgnoreCase(status)) passed = 0;

    Page<Score> scorePage = scoreRepository.findByFilters(userId, subjectName, semester, passed, pageable);

    List<ScoreAdminDto> dtoList = new ArrayList<>();
    for (Score score : scorePage.getContent()) {
        List<Subject> preSubjects = prerequisiteService.getAllPrerequisiteSubjectsBySubjectId(score.getSubject().getId());
        dtoList.add(new ScoreAdminDto(score, preSubjects));
    }
    return new PageImpl<>(dtoList, pageable, scorePage.getTotalElements());
}
        public ByteArrayInputStream exportScoreToExcel(List<ScoreAdminDto> scores) throws IOException {
            try (Workbook workbook = new XSSFWorkbook()) {
                Sheet sheet = workbook.createSheet("Scores");

                Row header = sheet.createRow(0);
                header.createCell(0).setCellValue("STT");
                header.createCell(1).setCellValue("Mã môn học");
                header.createCell(2).setCellValue("Tên môn học");
                header.createCell(3).setCellValue("MSSV");
                header.createCell(4).setCellValue("Học kỳ");
                header.createCell(5).setCellValue("Năm học");
                header.createCell(6).setCellValue("Điểm");
                header.createCell(7).setCellValue("Kết quả");

                int rowIdx = 1;
                for (ScoreAdminDto dto : scores) {
                    Row row = sheet.createRow(rowIdx++);
                    row.createCell(0).setCellValue(rowIdx-1);
                    row.createCell(1).setCellValue(dto.getSubject().getId());
                    row.createCell(2).setCellValue(dto.getSubject().getSubjectName());
                    row.createCell(3).setCellValue(dto.getUser().getId());
                    row.createCell(4).setCellValue(dto.getSemester());
                    row.createCell(5).setCellValue(dto.getYear()+" - "+(dto.getYear()+1));
                    row.createCell(6).setCellValue(dto.getScore());
                    row.createCell(7).setCellValue(dto.getPassed()==1 ? "Passed" : "Failed");
                }

                ByteArrayOutputStream out = new ByteArrayOutputStream();
                workbook.write(out);
                return new ByteArrayInputStream(out.toByteArray());
            }
        }


        public void updateScore(ScoreUpdateDTO dto) {
            Score score = scoreRepository.getReferenceById(dto.getId());
            if(dto.getScore()!=null){
            score.setScore(dto.getScore());
            if(dto.getScore()>=5){
                score.setPassed(1);
            }else{
                score.setPassed(0);
            }
            }
            scoreRepository.save(score);

        }

        public void addScore(ScoreAdd dto) {
            Score find = scoreRepository.findBySubjectIdAndUserIdAndSemesterAndYear(dto.getSubjectId(), dto.getUserId(), dto.getSemester(), dto.getYear());
            if (find != null) {
                System.out.println("Đã tồn tại score, thực hiện cập nhập score id" + find.getId() +"với :"+dto.getScore() );
                find.setScore(dto.getScore());
                if (dto.getScore() >= 5) {
                    find.setPassed(1);
                } else {
                    find.setPassed(0);
                }
                scoreRepository.save(find);
            } else {
                Score score = new Score();
                User user = userRepository.getReferenceById(dto.getUserId());
                Subject subject = subjectRepository.getReferenceById(dto.getSubjectId());
                score.setUser(user);
                score.setSubject(subject);
                score.setSemester(dto.getSemester());
                score.setYear(dto.getYear());
                score.setScore(dto.getScore());
                if (dto.getScore() >= 5) {
                    score.setPassed(1);
                } else {
                    score.setPassed(0);
                }
                scoreRepository.save(score);
                System.out.println(" thêm score mới thành công");
            }
        }
    }
