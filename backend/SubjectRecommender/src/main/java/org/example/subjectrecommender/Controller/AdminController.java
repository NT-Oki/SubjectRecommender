package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Service.AdminService;
import org.example.subjectrecommender.component.FileStorageComponent;
import org.example.subjectrecommender.component.ImportProgressTracker;
import org.example.subjectrecommender.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {
    @Autowired
    AdminService adminService;
    @Autowired
    ImportProgressTracker importProgressTracker ;
    @Autowired
    private FileStorageComponent fileStorageComponent;

    @GetMapping("/scores")
    public ResponseEntity<?> scoreList(  @RequestParam(defaultValue = "0") int page,
                                         @RequestParam(defaultValue = "10") int size,
                                         @RequestParam(required = false) String userId,
                                         @RequestParam(required = false) String subjectName,
                                         @RequestParam(required = false) Integer semester,
                                         @RequestParam(required = false) String status){
        Pageable pageable = PageRequest.of(page, size);
        Page<ScoreAdminDto> responseDTOList= adminService.getAllScoreResponse(userId,subjectName,semester,status,pageable);
        int total = (int)responseDTOList.getTotalElements();
        int fromIndex = page * size;
        if (fromIndex >= total) {
            return ResponseEntity.ok(Map.of("scores", List.of(), "total", total));
        }
        List<ScoreAdminDto> scoreList = responseDTOList.getContent();
        Map<String,Object> response= new HashMap<>();
        response.put("scores",scoreList);
        response.put("total",total);
        response.put("page", responseDTOList.getNumber());
        response.put("size", responseDTOList.getSize());

        return ResponseEntity.ok(response);

    }
    @GetMapping("/users")
    public ResponseEntity<?> studentList(  @RequestParam(defaultValue = "0") int page,
                                           @RequestParam(defaultValue = "10") int size,
                                           @RequestParam(required = false) String userId,
                                           @RequestParam(required = false) String userName,
                                           @RequestParam(required = false) Integer year){
        Pageable pageable = PageRequest.of(page, size);

        Page<UserDTO> responseDTOList= adminService.getAllUserResponse(userId,userName,year,pageable);
        int total = (int)responseDTOList.getTotalElements();
        int fromIndex = page * size;
        if (fromIndex >= total) {
            return ResponseEntity.ok(Map.of("scores", List.of(), "total", total));
        }
        List<UserDTO> userList = responseDTOList.getContent();
        Map<String,Object> response= new HashMap<>();
        response.put("users",userList);
        response.put("total",total);
        response.put("page", responseDTOList.getNumber());
        response.put("size", responseDTOList.getSize());

        return ResponseEntity.ok(response);
    }
    @GetMapping("/scores/export")
    public ResponseEntity<InputStreamResource> exportScoresToExcel() throws IOException {
        List<ScoreAdminDto> dtoList = adminService.getAllScore();

        ByteArrayInputStream in = adminService.exportScoreToExcel(dtoList);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=scores.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
    @GetMapping("/users/export")
    public ResponseEntity<InputStreamResource> exportUsersToExcel() throws IOException {
        List<UserDTO> dtoList = adminService.getAllUser();

        ByteArrayInputStream in = adminService.exportUserToExcel(dtoList);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=users.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }
    @PutMapping("/score")
    public ResponseEntity<?> updateScore(@RequestBody ScoreUpdateDTO dto){
        try{adminService.updateScore(dto);
            return ResponseEntity.ok("Cập nhật điểm thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()+"Cập nhật điểm thất bại");
        }

    }
    @PutMapping("/student")
    public ResponseEntity<?> updateStudent(@RequestBody UserUpdateDTO dto){
        try{adminService.updateUser(dto);
            return ResponseEntity.ok("Cập nhật điểm thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()+"Cập nhật điểm thất bại");
        }

    }
    //Thêm 1 score
    @PostMapping("/score")
    public ResponseEntity<?> addScore(@RequestBody ScoreAddDTO dto){
        try{
            adminService.addScore(dto);
            return ResponseEntity.ok("Thêm 1 score thành công ");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()+" thêm 1 score thất bại");
        }
    }

    //Thêm 1 user
    @PostMapping("/user")
    public ResponseEntity<?> addUser(@RequestBody UserAddDTO dto){
        try{
            adminService.addUser(dto,dto.getRole(),dto.getCurriculumId());
            return ResponseEntity.ok("Thêm 1 user thành công ");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()+" thêm 1 user thất bại");
        }
    }
    //check mssv để tránh trùng
    @GetMapping("/users/exist")
    public ResponseEntity<?> addUser(@RequestParam String userId){
        try{
           boolean isExist= adminService.checkExistbyId(userId);
            return ResponseEntity.ok(isExist);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/curriculum")
    public ResponseEntity<?> getCurriculumCourse(@RequestParam String curriculumId, @RequestParam String subjectSearch){
        try{
            Map<String, List<CurriculumCourseDTO>> listCurriculumCourse= adminService.getAll(curriculumId,subjectSearch);
            Map<String,Object> result = new HashMap<>();
            result.put("listCurriculumCourse",listCurriculumCourse);
            return ResponseEntity.ok(result);
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage()+" Lấy thông tin chương trình đào tạo thất bại "+curriculumId);
        }

    }
    @GetMapping("/curriculum/export")
    public ResponseEntity<?> exportCurriculumCourse(@RequestParam String curriculumId, @RequestParam String subjectSearch){
        try {
            ByteArrayInputStream excelFile = adminService.exportCurriculum(curriculumId, subjectSearch);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=curriculum_" + curriculumId + ".xlsx");

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(new InputStreamResource(excelFile));
        } catch (IOException e) {
            return ResponseEntity
                    .badRequest()
                    .body("Export chương trình đào tạo thất bại với " + curriculumId + " và " + subjectSearch + ". Lỗi: " + e.getMessage());
        }
    }

    @PostMapping("/upload-temp")
    public ResponseEntity<?> uploadTemp(@RequestParam MultipartFile file) throws IOException {
        String fileId = UUID.randomUUID().toString().substring(0,10);
        Path tempFile = fileStorageComponent.createTempFile(fileId, ".xlsx");
        file.transferTo(tempFile.toFile());//lưu file
        fileStorageComponent.put(fileId, tempFile);// Lưu đường dẫn vào map để theo dõi
        importProgressTracker.setProgress(fileId, 0);
        Map<String,Object> result = new HashMap<>();
        result.put("fileId",fileId);
        result.put("filePath",tempFile.toAbsolutePath().toString());
        return ResponseEntity.ok(result);
    }
    @PostMapping("/scores/import")
    public ResponseEntity<?> importScore(
            @RequestBody ImportRequestDto fileId
           ) throws IOException {
        System.out.println("fileId:"+fileId);
//        Path path = Paths.get(filePath);
        Path path = fileStorageComponent.get(fileId.getFileId());
        System.out.println("path:"+path);
        if (path == null || !Files.exists(path)) {

            importProgressTracker.setProgress(fileId.getFileId(), -1);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("File không tồn tại hoặc đã hết hạn");
        }
         adminService.importScore(path.toFile(), fileId.getFileId());

//        adminService.exportErrorRowsToExcel(erroRows,"./data/erro.xlsx");
//        importProgressTracker.setProgress(fileId, 100); // đảm bảo hoàn tất
        Map<String,Object> result = new HashMap<>();
        result.put("fileId", fileId);
//        result.put("erroRows",erroRows);
//        return ResponseEntity.ok(result);
        return ResponseEntity.ok(result);
    }
    @GetMapping("/progress")
    public ResponseEntity<Integer> getProgress(@RequestParam String fileId) {
        return ResponseEntity.ok(importProgressTracker.getProgress(fileId));
    }
    @GetMapping("/import/errors")
    public ResponseEntity<Map<String, Object>> getImportErrors(@RequestParam String fileId) throws IOException {
        Map<String, Object> result = new HashMap<>();
        List<ErrorRow> erroRows = importProgressTracker.getErrorRows(fileId);
        result.put("erroRows", erroRows);
        adminService.cleanupImportData(fileId, fileStorageComponent);
        return ResponseEntity.ok(result);

    }
    @PostMapping("/export-erros")
    public ResponseEntity<?> exportErrors(@RequestBody List<ErrorRow> data) throws IOException {
        try {
            // Log để kiểm tra dữ liệu nhận được từ frontend
            System.out.println("Received export request for " + data.size() + " error rows.");

            // Gọi service để tạo luồng Excel
            ByteArrayInputStream excelStream = adminService.exportErrorRowsToExcel(data);

            // Chuẩn bị headers cho việc tải xuống file
            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Disposition", "attachment; filename=scores_erros.xlsx"); // Tên file khi tải xuống
            headers.add("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"); // MIME type cho .xlsx

            return ResponseEntity
                    .ok()
                    .headers(headers)
                    .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                    .body(new InputStreamResource(excelStream)); // Gửi luồng dữ liệu
        } catch (IOException e) {
            return ResponseEntity
                    .badRequest()
                    .body("Export lỗi trong khi import score . Lỗi: " + e.getMessage());
        }
    }
    @PostMapping("/users/import")
    public ResponseEntity<?> importUsers(
            @RequestBody UserImportDTO userImportDTO
    ) throws IOException {

        Path path = fileStorageComponent.get(userImportDTO.getFileId());
        System.out.println("path:"+path);
        if (path == null || !Files.exists(path)) {

            importProgressTracker.setProgress(userImportDTO.getFileId(), -1);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("File không tồn tại hoặc đã hết hạn");
        }
        adminService.importUser(path.toFile(),userImportDTO.getRole(),userImportDTO.getCurriculumVersion(), userImportDTO.getFileId());
        Map<String,Object> result = new HashMap<>();
        result.put("fileId", userImportDTO);
        return ResponseEntity.ok(result);
    }

}
