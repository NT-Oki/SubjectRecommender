package org.example.subjectrecommender.Service;

import org.example.subjectrecommender.Model.CurriculumCourse;
import org.example.subjectrecommender.component.FileStorageComponent;
import org.example.subjectrecommender.database.ImportData;
import org.example.subjectrecommender.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.util.List;
import java.util.Map;

@Service
public class AdminService {
    @Autowired
    ScoreService scoreService;
    @Autowired
    UserService userService;
    @Autowired
    CurriculumCourseService curriculumCourseService;
    @Autowired
    ImportData importData;

    public List<ScoreAdminDto> getAllScore() {
        return scoreService.getAll();
    }
    public List<UserDTO> getAllUser() {
        return userService.getUserDTOList();
    }
    public Page<ScoreAdminDto> getAllScoreResponse(String userId, String subjectName, Integer semester, String status, Pageable pageable) {
        return scoreService.getAllScorePageWithFilterUsingQuery(userId,subjectName,semester,status,pageable);

    }
    public ByteArrayInputStream exportScoreToExcel(List<ScoreAdminDto> scores) throws IOException {
        return scoreService.exportScoreToExcel(scores);
    }
    public Page<UserDTO> getAllUserResponse(String userId, String userName, Integer year, Pageable pageable) {
        return userService.getUserDtoFilter(userId,userName,year,pageable);

    }
    public ByteArrayInputStream exportUserToExcel(List<UserDTO> users) throws IOException {
        return userService.exportUserToExcel(users);
    }

    public void updateScore(ScoreUpdateDTO dto) {
         scoreService.updateScore(dto);
    }

    public void updateUser(UserUpdateDTO dto) {
        userService.updateUser(dto);
    }

    public void addScore(ScoreAddDTO dto) {
        scoreService.addScore(dto);
    }
    public boolean checkExistbyId(String id) {
        return userService.checkIdExists(id);
    }

    public void addUser(UserAddDTO dto) {
         userService.addUser(dto);
    }
    public Map<String,List<CurriculumCourseDTO>> getAll(String curriculumId, String subjectSearch){
        return curriculumCourseService.findAlLGroupByCurriculumId(curriculumId,subjectSearch);
    }
    public ByteArrayInputStream exportCurriculum(String curriculumId, String subjectSearch ) throws IOException {
        return curriculumCourseService.export(curriculumId,subjectSearch);
    }
    public void importScore(File file, String fileId) throws IOException {
         importData.importScore(file,fileId);
    }
    public ByteArrayInputStream exportErrorRowsToExcel(List<ErrorRow> errorRows) throws IOException {
        return importData.exportErrorRowsToExcel(errorRows);
    }
    public void cleanupImportData(String fileId, FileStorageComponent fileStorage) throws IOException {
        importData.cleanupImportData(fileId,fileStorage);

    }
}
