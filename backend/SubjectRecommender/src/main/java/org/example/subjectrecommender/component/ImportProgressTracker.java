package org.example.subjectrecommender.component;

import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class ImportProgressTracker {
    private final Map<String, Integer> progressMap = new ConcurrentHashMap<>();

    public void setProgress(String fileId, int percent) {
        progressMap.put(fileId, percent);
    }

    public int getProgress(String fileId) {
        return progressMap.getOrDefault(fileId, 0);
    }

    public void clearProgress(String fileId) {
        progressMap.remove(fileId);
    }
}
