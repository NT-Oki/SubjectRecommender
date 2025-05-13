package org.example.subjectrecommender.database;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

@RestController
public class ImportController {
    ImportData importData;
    public ImportController(ImportData importData) {
        this.importData = importData;
    }
    @PostMapping("/import")
    public ResponseEntity<String> importData() throws IOException {
        String path = "D:\\3.study\\TIỂU LUẬN\\data_2.xlsx";
        try {
//            importData.importSubject(new FileInputStream(path));
        importData.importPrerequisite(new FileInputStream(path));
//            importData.importCurriculumCourse(new FileInputStream(path));
           // importData.importUser(new FileInputStream(path));
           // importData.importScore(new FileInputStream(path));
            return ResponseEntity.ok("Thêm dữ liệu thành công");
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Lỗi khi import dữ liệu: " + e.getMessage());
        }
    }
}
