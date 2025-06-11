package org.example.subjectrecommender.component;


import org.springframework.stereotype.Component;

import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;

@Component // Đánh dấu là một Spring Component để Spring quản lý nó
public class FileStorageComponent {

    // Đây là map sẽ chứa các đường dẫn file tạm thời, và nó sẽ là singleton
    private final Map<String, Path> storageMap = new ConcurrentHashMap<>();

    private final Path TEMP_UPLOAD_DIR;

    public FileStorageComponent() throws IOException {
        // Khởi tạo thư mục tạm thời khi component được tạo
        this.TEMP_UPLOAD_DIR = Paths.get("./data/temp_uploads").toAbsolutePath().normalize();
        Files.createDirectories(TEMP_UPLOAD_DIR);
    }

    public void put(String fileId, Path path) {
        storageMap.put(fileId, path);
    }

    public Path get(String fileId) {
        return storageMap.get(fileId);
    }

    public Path remove(String fileId) {
        Path path = storageMap.remove(fileId); // Xóa khỏi Map và lấy ra Path
        if (path != null) {
            try {
                Files.deleteIfExists(path); // <-- Xóa file vật lý ở đây!
                System.out.println("Cleaned up temp file: " + path.toAbsolutePath());
            } catch (IOException e) {
                System.err.println("Error cleaning up temp file " + path.toAbsolutePath() + ": " + e.getMessage());
            }
        }
        return path; // Trả về Path để biết file nào đã được xử lý
    }

    // Bạn có thể thêm một phương thức để tạo đường dẫn tạm thời ở đây
    public Path createTempFile(String fileId, String suffix) throws IOException {
        // Sử dụng UUID.randomUUID().toString() đầy đủ để giảm khả năng trùng lặp
        // Hoặc bạn có thể tiếp tục với substring(0,10) nếu bạn chấp nhận rủi ro và biết nó đủ duy nhất cho mục đích của bạn
        return Files.createTempFile(TEMP_UPLOAD_DIR, fileId + "-", suffix);
    }

    // Phương thức để lấy TEMP_UPLOAD_DIR
    public Path getTempUploadDir() {
        return TEMP_UPLOAD_DIR;
    }
}
