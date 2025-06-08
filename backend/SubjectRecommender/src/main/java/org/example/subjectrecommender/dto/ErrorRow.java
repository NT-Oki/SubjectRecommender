package org.example.subjectrecommender.dto;

import lombok.Data;

import java.util.List;

@Data
public class ErrorRow {
    private int rowNumber;
    private List<String> rowData;
    private String errorReason;
}
