package org.example.subjectrecommender.database;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.example.subjectrecommender.Model.*;
import org.example.subjectrecommender.Service.*;
import org.example.subjectrecommender.component.FileStorageComponent;
import org.example.subjectrecommender.component.ImportProgressTracker;
import org.example.subjectrecommender.config.ValueProperties;
import org.example.subjectrecommender.dto.ErrorRow;
import org.example.subjectrecommender.dto.ScoreAddDTO;
import org.example.subjectrecommender.util.ConvertToUnicode;
import org.example.subjectrecommender.util.PasswordUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.Collectors;

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
    @Autowired
    private ImportProgressTracker tracker;
    @Autowired
    ValueProperties valueProperties;

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

    public List<String> isValidSemesterFormat(String value) {//kiểm tra xem có đúng định dạng (hk1/2022-2023)
        //  hk1/2022-2023 hoặc hk2/2021-2022
        List<String> result=new ArrayList<>();//"ok","erro"
        if(value.matches("(?i)hk[12]/\\d{4}-\\d{4}")){
            result.add(value);
            result.add("ok");
        }else{
            result.add("Mã sv sai định dạng -vd:hkX/YYYY-YYYY (X=1;2)");
            result.add("erro");
        }
        return result;
    }
    public List<String> checkLengthMssv(String mssv){
        List<String> result=new ArrayList<>();//"ok","erro"
        if(mssv.length()==8){
            result.add(mssv);
            result.add("ok");
        }else{
            result.add("Mã sv phải chứa 8 kí tự");
            result.add("erro");
        }
        return result;
    }
    public String checkValidYear(int year1, int year2){
        if(year2==year1+1){
            return "ok";
        }else{
            return "Năm học phải là 2 năm liên tiếp";
        }
    }
    public List<String> checkLengthMaMonHoc(String maMH){
        List<String> result=new ArrayList<>();//"ok","erro"
        if(maMH.length()==6){
            result.add(maMH);
            result.add("ok");
        }else{
            result.add("Mã môn học phải chứa 6 kí tự");
            result.add("erro");
        }
        return result;
    }
  public String checkValidScore(float score){//kiểm tra xem có nằm trong khoang(0-10)
        if(0<=score&&score<=10){
            return "ok";
        }else{
            return "Điểm có giá trị nằm ngoài (0-10)";
        }
  }
    public List<String> getValidateString(Cell cell) {//hàm muốn trả về kiểu string

//        if (cell == null) return "";
        List<String> result=new ArrayList<>();//"ok", "erro" get(01)
        try{
        CellType cellType = cell.getCellType();
        switch (cellType) {
            case STRING:
                result.add(cell.getStringCellValue().trim());
                result.add("ok");
                break;
            case NUMERIC:
                // Chuyển số sang chuỗi (loại bỏ phần thập phân nếu là số nguyên)
                double num = cell.getNumericCellValue();
                try{
                    if (num == Math.floor(num)) {
                        result.add(String.valueOf((long) num));
                        result.add("ok");
                    }
                }catch (Exception e){
                    result.add("getValidateString "+num +"thất bại: "+e.getMessage());
                    result.add("erro");
                }
                break;
            default:
                result.add("getValidateString thất bại");
                result.add("erro");
        }
        return result;
        } catch (Exception e) {
            result.add("lỗi xử lí ô "+e.getMessage());
            result.add("erro");
            return result;
        }
    }
    public List<Double> getValidateNumber(Cell cell) {//hàm muốn trả về kiểu string

//        if (cell == null) return "";
        List<Double> result=new ArrayList<>();//0:lỗi 1.0:oke
        try{
            CellType cellType = cell.getCellType();
            switch (cellType) {
                case NUMERIC:
                    result.add(Math.round(cell.getNumericCellValue()*10.0)/10.0);
                    result.add(1.0);
                    break;
                case STRING:
                    // Chuyển số sang chuỗi (loại bỏ phần thập phân nếu là số nguyên)
                    String num_String = cell.getStringCellValue().trim();
                    try{
                        double num = Math.round(Double.parseDouble(num_String)*10.0)/10.0;
                        result.add(num);
                        result.add(1.0);
                    }catch (Exception e){
                        result.add(-99.0);
                        result.add(0.0);
                    }
                    break;
                default:
                    result.add(-99.0);
                    result.add(0.0);
            }
            return result;
        } catch (Exception e) {
            result.add(-99.0);
            result.add(0.0);
            return result;
        }
    }
    public void addErroRow(List<ErrorRow> list,int rowIndex,Row row,String reasonErro){
        ErrorRow errorRow=new ErrorRow();
        errorRow.setRowNumber(rowIndex);
        List<String> rowData = new ArrayList<>();
        for (Cell cell : row) {
            rowData.add(cell.toString());
        }
        errorRow.setRowData(rowData);
        errorRow.setErrorReason(reasonErro);
        list.add(errorRow);

    }
    public void addErroRowHeader(List<ErrorRow> list,int rowIndex,String reasonErro){
        ErrorRow errorRow=new ErrorRow();
        errorRow.setRowNumber(rowIndex);
        List<String> rowData = new ArrayList<>();
        rowData.add("không có dữ liệu");
        errorRow.setRowData(rowData);
        errorRow.setErrorReason(reasonErro);
        list.add(errorRow);

    }
    @Async
    public void importScore(File file, String fileId) throws IOException {
        List<ErrorRow> errorRows = new ArrayList<>();
        try (InputStream is = new FileInputStream(file);
             Workbook workbook = new XSSFWorkbook(is)
        ) {
            Sheet sheet = workbook.getSheet("Diem");
            if (sheet == null) {
                tracker.setProgress(fileId, -1); // Báo lỗi
                addErroRowHeader(errorRows,0,"Không tìm thấy sheet Diem");
                tracker.setErrorRows(fileId, errorRows); // Lưu lỗi vào tracker
                return;
            }
            List<ScoreAddDTO> scores=new ArrayList<>();
            Row headerRow = sheet.getRow(0);
            if (headerRow == null) {
                tracker.setProgress(fileId, -1);
                addErroRowHeader(errorRows,0,"File Excel không có hàng tiêu đề.");
                tracker.setErrorRows(fileId, errorRows);
                return;
            }
            Map<String, Integer> columnIndex = new HashMap<>();
            // Lấy vị trí cột theo tên
            for (Cell cell : headerRow) {
                columnIndex.put(cell.getStringCellValue().trim(), cell.getColumnIndex());
            }
            String[] requiredColumns = {"Mã Sv", "Học kỳ", "Mã môn học", "Điểm"};
            boolean isAllHeader = Arrays.stream(requiredColumns)
                    .allMatch(col -> columnIndex.containsKey(col));
            if(!isAllHeader){
                tracker.setProgress(fileId, -1);
                addErroRowHeader(errorRows,0,"Hàng tiêu đề thiếu cột");
                tracker.setErrorRows(fileId, errorRows);
                return;
            }
            int totalRows = sheet.getLastRowNum();
            for (int i = 1; i <= totalRows; i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                ScoreAddDTO score = new ScoreAddDTO();
                Cell mssv_cell=row.getCell(columnIndex.get("Mã Sv"));
                List<String> mssv_get=getValidateString(mssv_cell);
                if(!(mssv_get.get(1).equals("ok"))){
                    addErroRow(errorRows,i,row,mssv_get.get(0));
                    continue;
                }
                List<String> checkLengthMssv=checkLengthMssv(mssv_get.get(0));
                if(!(checkLengthMssv.get(1).equals("ok"))){
                    addErroRow(errorRows,i,row,checkLengthMssv.get(0));
                    continue;
                }
                String mssv=mssv_get.get(0);
                score.setUserId(mssv);
                Cell hocky_cell=row.getCell(columnIndex.get("Học kỳ"));
                List<String> hocky_get = getValidateString(hocky_cell);
                if(!(hocky_get.get(1).equals("ok"))){
                    addErroRow(errorRows,i,row,hocky_get.get(0));
                    continue;
                }
                List<String> isValidSemesterFormat=isValidSemesterFormat(hocky_get.get(0));
                if(!(isValidSemesterFormat.get(1).equals("ok"))){
                    addErroRow(errorRows,i,row,isValidSemesterFormat.get(0));
                    continue;
                }
                List<Integer> semesters=ConvertToUnicode.extractNumbers(hocky_get.get(0));
                String checkValidYear =checkValidYear(semesters.get(1),semesters.get(2));
                if(!checkValidYear.equals("ok")){
                    addErroRow(errorRows,i,row,checkValidYear);
                    continue;
                }
                int semester = semesters.get(0);
                int year =semesters.get(1);
                score.setSemester(semester);
                score.setYear(year);
                Cell maMh_cell=row.getCell(columnIndex.get("Mã môn học"));
                List<String> maMh_get = getValidateString(maMh_cell);
                if(!(maMh_get.get(1).equals("ok"))){
                    addErroRow(errorRows,i,row,maMh_get.get(0));
                    continue;
                }
                List<String> checkLengthMaMh=checkLengthMaMonHoc(maMh_get.get(0));
                if(!(checkLengthMaMh.get(1).equals("ok"))){
                    addErroRow(errorRows,i,row,checkLengthMaMh.get(0));
                    continue;
                }
                String maMh=maMh_get.get(0);
                score.setSubjectId(maMh);
                Cell diem_cell=row.getCell(columnIndex.get("Điểm"));
                List<Double> diem_get = getValidateNumber(diem_cell);
                if(!(diem_get.get(1)==1.0)){
                    addErroRow(errorRows,i,row,"Dữ liệu điểm không lấy ra được-getValidateNumber()");
                    continue;
                }
                String checkValidScore=checkValidScore(diem_get.get(0).floatValue());
                if(!(checkValidScore.equals("ok"))){
                    addErroRow(errorRows,i,row,checkValidScore);
                    continue;
                }
                float diem=diem_get.get(0).floatValue();
                score.setScore(diem);
                scores.add(score);

                int currentProgress = (int) (((double) i /totalRows ) * 90);
                tracker.setProgress(fileId, Math.min(currentProgress, 99));

            }
            int scoresSavedCount = 0;
            for (ScoreAddDTO dto : scores) {
                try {
                    scoreService.addScore(dto);
                    scoresSavedCount++;
                    // Cập nhật tiến trình cho giai đoạn lưu DB (ví dụ: 90-99%)
                    int saveProgress = 90 + (int) (((double) scoresSavedCount / scores.size()) * 9);
                    tracker.setProgress(fileId, Math.min(saveProgress, 99));
                } catch (Exception e) {
                    // Xử lý lỗi khi lưu từng bản ghi vào DB
                    System.err.println("Lỗi khi lưu điểm cho SV " + dto.getUserId() + ": " + e.getMessage());
                    // Bạn có thể thêm lỗi này vào errorRows nếu muốn hiển thị chi tiết lỗi DB
                    // errorRows.add(new ErrorRow(dto.getUserId(), "Lỗi DB: " + e.getMessage()));
                }
            }
            tracker.setProgress(fileId, 100); // Hoàn tất tiến trình khi mọi thứ đã xong
            tracker.setErrorRows(fileId, errorRows);
        }catch (IOException e){
            e.printStackTrace();
            tracker.setProgress(fileId, -1); // Báo lỗi IO
            addErroRowHeader(errorRows,0,"Lỗi đọc file: " + e.getMessage());
            tracker.setErrorRows(fileId, errorRows);
        } catch (Exception e) {
            e.printStackTrace();
            tracker.setProgress(fileId, -1); // Báo lỗi chung
            addErroRowHeader(errorRows,0,"Lỗi không xác định trong quá trình import: " + e.getMessage());
            tracker.setErrorRows(fileId, errorRows);
        }
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
    public ByteArrayInputStream  exportErrorRowsToExcel(List<ErrorRow> errorRows) throws IOException {
        String outputPath = valueProperties.getPathFileExportScoreErro();
        try(Workbook workbook = new XSSFWorkbook();
            ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("ErrorRows");

            // Tạo header
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Row Number");
            headerRow.createCell(1).setCellValue("Row Data");
            headerRow.createCell(2).setCellValue("Error Reason");

            // Điền dữ liệu từng dòng
            int rowNum = 1;
            for (ErrorRow errorRow : errorRows) {
                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(errorRow.getRowNumber());

                // Nối danh sách rowData thành chuỗi, ví dụ: "cell1, cell2, cell3"
                String rowDataStr = errorRow.getRowData().stream()
                        .collect(Collectors.joining(", "));
                row.createCell(1).setCellValue(rowDataStr);

                row.createCell(2).setCellValue(errorRow.getErrorReason());
            }

            // Tự động điều chỉnh độ rộng các cột
            for (int i = 0; i < 3; i++) {
                sheet.autoSizeColumn(i);
            }
            workbook.write(out);

            workbook.close();
            return new ByteArrayInputStream(out.toByteArray());
        }

    }
    public void cleanupImportData(String fileId, FileStorageComponent fileStorage) {
        // Xóa tiến trình và lỗi từ tracker
        tracker.removeProgress(fileId);

        // Xóa file tạm thời nếu còn tồn tại
        Path tempFile = fileStorage.remove(fileId); // Xóa khỏi map và lấy ra Path
        if (tempFile != null && Files.exists(tempFile)) {
            try {
                Files.delete(tempFile);
                System.out.println("Đã xóa file tạm thời: " + tempFile);
            } catch (IOException e) {
                System.err.println("Không thể xóa file tạm thời: " + tempFile + ". Lỗi: " + e.getMessage());
            }
        }
    }



}
