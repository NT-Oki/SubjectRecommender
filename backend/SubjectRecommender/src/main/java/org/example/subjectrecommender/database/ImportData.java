package org.example.subjectrecommender.database;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.subjectrecommender.Model.*;
import org.example.subjectrecommender.Service.*;
import org.example.subjectrecommender.util.ConvertToUnicode;
import org.example.subjectrecommender.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

@Service
public class ImportData {
    @Autowired
    SubjectGroupService subjectGroupService;
    @Autowired
    SubjectService subjectService;
    @Autowired
    PrerequisiteService prerequisiteService;
    @Autowired
    CurriculumVersionService curriculumVersionService;
    @Autowired
    CurriculumCourseService curriculumCourseService;
    @Autowired
    UserService userService;
    @Autowired
    ScoreService scoreService;


    public Sheet getSheet(InputStream inputStream, String sheetName) throws IOException {
       // inputStream=new FileInputStream(new File("D:\\3.study\\TIỂU LUẬN\\data.xlsx"));
        Sheet sheet = null;
        Workbook workbook = new XSSFWorkbook(inputStream);
        sheet = workbook.getSheet(sheetName);
        return sheet;
    }
    public void importSubject(InputStream inputStream) throws IOException {
        Sheet sheet = getSheet(inputStream, "CTDT");
        List<Subject> subjects = new ArrayList<Subject>();
        Row headerRow = sheet.getRow(0);
        Map<String, Integer> columnIndex = new HashMap<>();

        // Lấy vị trí cột theo tên
        for (Cell cell : headerRow) {
            columnIndex.put(cell.getStringCellValue().trim(), cell.getColumnIndex());
        }

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            SubjectGroup subjectGroup = new SubjectGroup();
            if (row == null) continue;
            String group=row.getCell(columnIndex.get("BBTC")).getStringCellValue().trim();
            Subject s = new Subject();
            s.setId(row.getCell(columnIndex.get("Mã môn học")).getStringCellValue().trim());
            s.setCredit((int)row.getCell(columnIndex.get("Số TC")).getNumericCellValue());
            s.setSubjectName(row.getCell(columnIndex.get("Tên môn học")).getStringCellValue());
            if(group.isBlank()){
                subjectGroup=subjectGroupService.getById("BB");
            }else{
                subjectGroup=subjectGroupService.getById(group);
            }
            s.setSubjectGroup(subjectGroup);
            subjectService.save(s);
            subjects.add(s);
        }

        System.out.println("Đã thêm vào bảng subjects: "+subjects.size());

    }
    public void importPrerequisite(InputStream inputStream) throws IOException {
        Sheet sheet = getSheet(inputStream, "CTDT");
        List<Prerequisite> prerequisiteList=new ArrayList<>();
        Row headerRow = sheet.getRow(0);
        Map<String, Integer> columnIndex = new HashMap<>();

        // Lấy vị trí cột theo tên
        for (Cell cell : headerRow) {
            columnIndex.put(cell.getStringCellValue().trim(), cell.getColumnIndex());
        }

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;
            String mamonhoc=row.getCell(columnIndex.get("Mã môn học")).getStringCellValue().trim();
            Subject s = subjectService.getSubjectById(mamonhoc);
            String haveMonhoctruoc=row.getCell(columnIndex.get("Môn học trước")).getStringCellValue().trim();
            Prerequisite p = new Prerequisite();
            if(!haveMonhoctruoc.isBlank()){
                String[] id_monhoctruoc=haveMonhoctruoc.split("\n");
                for(String id:id_monhoctruoc){
                    Subject subject_hoctruoc=subjectService.getSubjectById(id);
                    p.setPrerequisiteSubject(subject_hoctruoc);
                    p.setSubject(s);
                    prerequisiteList.add(p);
                    prerequisiteService.save(p);
                }
            }

        }

        System.out.println("Đã thêm thành công vào prerequisites: "+prerequisiteList.size());

    }
    public void importCurriculumCourse(InputStream inputStream) throws IOException {
        Sheet sheet = getSheet(inputStream, "CTDT");
        List<CurriculumCourse> curriculumCourseList=new ArrayList<>();
        Row headerRow = sheet.getRow(0);
        Map<String, Integer> columnIndex = new HashMap<>();

        // Lấy vị trí cột theo tên
        for (Cell cell : headerRow) {
            columnIndex.put(cell.getStringCellValue().trim(), cell.getColumnIndex());
        }

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;
            CurriculumCourse curriculumCourse = new CurriculumCourse();
            String mamonhoc=row.getCell(columnIndex.get("Mã môn học")).getStringCellValue().trim();
            Subject s = subjectService.getSubjectById(mamonhoc);
            String ma_curriculumversion="7480201_2020";
            CurriculumVersion curriculumVersion=curriculumVersionService.getById(ma_curriculumversion);
            String is_required=row.getCell(columnIndex.get("BB")).getStringCellValue().trim();
            int required=!is_required.isBlank()?1:0;
            curriculumCourse.setSubject(s);
            curriculumCourse.setCurriculum(curriculumVersion);
            curriculumCourse.setSemester((int)row.getCell(columnIndex.get("Học kỳ")).getNumericCellValue());
            curriculumCourse.setYear((int)row.getCell(columnIndex.get("Năm")).getNumericCellValue());
            curriculumCourse.setRequired(required);
            curriculumCourseService.save(curriculumCourse);
            curriculumCourseList.add(curriculumCourse);
        }

        System.out.println("Đã thêm thành công vào curriculumcourses: "+curriculumCourseList.size());

    }
    public void importUser(InputStream inputStream) throws IOException {
        Sheet sheet = getSheet(inputStream, "DSSV");
        List<User> users=new ArrayList<>();
        Row headerRow = sheet.getRow(0);
        Map<String, Integer> columnIndex = new HashMap<>();

        // Lấy vị trí cột theo tên
        for (Cell cell : headerRow) {
            columnIndex.put(cell.getStringCellValue().trim(), cell.getColumnIndex());
        }

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;
            User user = new User();
            user.setId(row.getCell(columnIndex.get("masv")).getStringCellValue().trim());
            user.setLastName(row.getCell(columnIndex.get("Họ")).getStringCellValue().trim());
            user.setName(row.getCell(columnIndex.get("Tên")).getStringCellValue().trim());
            user.setEnrollmentYear(Integer.parseInt(row.getCell(columnIndex.get("Khóa")).getStringCellValue()));
            user.setMajor(row.getCell(columnIndex.get("Tên ngành")).getStringCellValue().trim());
            user.setPassword(PasswordUtil.hashPassword(ConvertToUnicode.removeAccentAndToLower(user.getName())+user.getId()));
            userService.save(user);
            users.add(user);
        }

        System.out.println("Đã thêm thành công vào users: "+users.size());

    }
    public void importScore(InputStream inputStream) throws IOException {
        Sheet sheet = getSheet(inputStream, "Diem");
        List<Score> scores=new ArrayList<>();
        Row headerRow = sheet.getRow(0);
        Map<String, Integer> columnIndex = new HashMap<>();

        // Lấy vị trí cột theo tên
        for (Cell cell : headerRow) {
            columnIndex.put(cell.getStringCellValue().trim(), cell.getColumnIndex());
        }

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {
            Row row = sheet.getRow(i);
            if (row == null) continue;
            Score score = new Score();
            String mssv=row.getCell(columnIndex.get("Mã Sv")).getStringCellValue().trim();
            User user = userService.getByID(mssv);
            String ma_monhoc=row.getCell(columnIndex.get("Mã môn học")).getStringCellValue().trim();
            Subject s = subjectService.getSubjectById(ma_monhoc);
            if(s==null) continue;
            float diem=(float)row.getCell(columnIndex.get("Điểm")).getNumericCellValue();
            int passed=diem<5.0?0:1;
            List<Integer> semesters=ConvertToUnicode.extractNumbers(row.getCell(columnIndex.get("Học kỳ")).getStringCellValue().trim());
            int semester=semesters.get(0);
            int year=semesters.get(1);
            score.setSubject(s);
            score.setUser(user);
            score.setScore(diem);
            score.setPassed(passed);
            score.setSemester(semester);
            score.setYear(year);
            scoreService.save(score);
            scores.add(score);

        }

        System.out.println("Đã thêm thành công vào scores: "+scores.size());

    }
    public void importUtility(){
        scoreService.updateAllUtility();
    }
    public void updateCurriculumVersionForUser(String curriculumId) {
        List<User> userList = userService.getUserList();

        CurriculumVersion curriculumVersion = curriculumVersionService.getById(curriculumId);
        for(User user : userList){
            user.setCurriculumVersion(curriculumVersion);
        }
        userService.saveAll(userList);
        System.out.println("Đã cập nhật thành công CurriculumVersion: "+userList.size());

    }
    public void updateRoleForUser(int role){
        List<User> userList = userService.getUserList();
        for(User user : userList){
            user.setRole(role);
        }
        userService.saveAll(userList);
        System.out.println("update role thành công");
    }



}
