package org.example.subjectrecommender.component;

// ImportProgressTracker.java
import org.example.subjectrecommender.dto.ErrorRow;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;
import java.util.List; // Import List

@Component
public class ImportProgressTracker {
    private final Map<String, Integer> progressMap = new ConcurrentHashMap<>();
    private final Map<String, List<ErrorRow>> errorRowsMap = new ConcurrentHashMap<>(); // Thêm map lưu lỗi

    public void setProgress(String fileId, int progress) {
        progressMap.put(fileId, progress);
    }

    public int getProgress(String fileId) {
        return progressMap.getOrDefault(fileId, 0);
    }

    public void setErrorRows(String fileId, List<ErrorRow> errors) {
        errorRowsMap.put(fileId, errors);
    }

    public List<ErrorRow> getErrorRows(String fileId) {
        return errorRowsMap.getOrDefault(fileId, new ArrayList<>()); // Trả về danh sách rỗng nếu không có
    }

    public void removeProgress(String fileId) {
        progressMap.remove(fileId);
        errorRowsMap.remove(fileId); // Xóa cả lỗi khi hoàn tất
    }
}