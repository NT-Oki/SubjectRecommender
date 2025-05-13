package org.example.subjectrecommender.Service;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

public class ExcelReader {
    public static void main(String[] args) throws IOException {
        // Đọc file Excel
        FileInputStream file = new FileInputStream(new File("D:\\3.study\\TIỂU LUẬN\\data.xlsx"));

        // Tạo Workbook từ file Excel
        XSSFWorkbook workbook = new XSSFWorkbook(file);

        // Lấy số lượng sheet trong file Excel
        int numberOfSheets = workbook.getNumberOfSheets();


        // Duyệt qua các sheet trong file Excel
        for (int i = 0; i < numberOfSheets; i++) {
            Sheet sheet = workbook.getSheetAt(i);
            System.out.println("Sheet Name: " + sheet.getSheetName());

            // Duyệt qua các dòng trong sheet
            for (Row row : sheet) {
                // Duyệt qua các cell trong mỗi dòng
                for (Cell cell : row) {
                    switch (cell.getCellType()) {
                        case STRING:
                            System.out.print(cell.getStringCellValue() + "\t");
                            break;
                        case NUMERIC:
                            System.out.print(cell.getNumericCellValue() + "\t");
                            break;
                        case BOOLEAN:
                            System.out.print(cell.getBooleanCellValue() + "\t");
                            break;
                        default:
                            System.out.print("Unknown Type\t");
                            break;
                    }
                }
                System.out.println();  // Xuống dòng sau mỗi dòng
            }
        }

        // Đóng workbook và file
        workbook.close();
        file.close();
    }
}
