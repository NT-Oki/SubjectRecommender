package org.example.subjectrecommender.Controller;

import org.example.subjectrecommender.Model.CurriculumCourse;
import org.example.subjectrecommender.Service.AdminService;
import org.example.subjectrecommender.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class AdminController {
    @Autowired
    AdminService adminService;

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
            adminService.addUser(dto);
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


}
