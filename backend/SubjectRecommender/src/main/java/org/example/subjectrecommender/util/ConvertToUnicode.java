package org.example.subjectrecommender.util;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ConvertToUnicode {
    public static String removeAccentAndToLower(String input) {
        // Loại bỏ dấu
        String normalized = Normalizer.normalize(input, Normalizer.Form.NFD);
        Pattern pattern = Pattern.compile("\\p{InCombiningDiacriticalMarks}+");
        String result = pattern.matcher(normalized).replaceAll("");

        // Chuyển thành chữ thường
        return result.toLowerCase();
    }
    public static List<Integer> extractNumbers(String input) {
        List<Integer> numbers = new ArrayList<>();
        Pattern pattern = Pattern.compile("\\d+");
        Matcher matcher = pattern.matcher(input);

        while (matcher.find()) {
            numbers.add(Integer.parseInt(matcher.group()));
        }

        return numbers; // hk2/2022-2023 -> 2,2022,2023
    }

    public static void main(String[] args) {
        String input = "Ngọc thảo";
        String result = removeAccentAndToLower(input);
        System.out.println(result);
    }
}
