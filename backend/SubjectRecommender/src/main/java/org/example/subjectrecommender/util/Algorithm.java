package org.example.subjectrecommender.util;

import ca.pfv.spmf.algorithms.frequentpatterns.efim.AlgoEFIM;
import org.example.subjectrecommender.Model.Score;
import org.example.subjectrecommender.Model.Subject;
import org.example.subjectrecommender.Model.User;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

public class Algorithm {
    public void validateInputFile(String inputPath) throws IOException {
        try (BufferedReader br = new BufferedReader(new FileReader(inputPath))) {
            String line;
            int lineNum = 0;
            while ((line = br.readLine()) != null) {
                lineNum++;
                if (!line.contains("#UTIL:")) {
                    System.err.println("Invalid line (missing #UTIL:) at line " + lineNum + ": " + line);
                    // Có thể ném exception nếu muốn dừng hoặc tiếp tục tuỳ ý:
                    // throw new IllegalArgumentException("Invalid input at line " + lineNum);
                }
                String[] parts = line.split("#UTIL:");
                if (parts.length != 2) {
                    System.err.println("Invalid format line at line " + lineNum + ": " + line);
                    // throw new IllegalArgumentException("Invalid input at line " + lineNum);
                }
            }
        }
    }

    public void runEFIM(String inputPath, String outputPath, int minUtil) throws IOException {
        boolean keepTransactions = false;// Có giữ giao dịch trong bộ nhớ hay không
        int maxMemory = 50000; // Giới hạn bộ nhớ (tùy chỉnh)
        boolean printVerbose = true;// In thông tin quá trình mining hay không

        AlgoEFIM algo = new AlgoEFIM();
        algo.runAlgorithm(minUtil, inputPath, outputPath, keepTransactions, maxMemory, printVerbose);
        algo.printStats();
    }
    public static List<List<Integer>> readItemsets(String efimResultFile) throws IOException {
        List<List<Integer>> itemsets = new ArrayList<>();
        List<String> lines = Files.readAllLines(Paths.get(efimResultFile));
        for (String line : lines) {
            String[] parts = line.split(" #UTIL:");
            List<Integer> itemset = Arrays.stream(parts[0].trim().split(" "))
                    .map(Integer::parseInt)
                    .collect(Collectors.toList());
            System.out.println(itemset);
            itemsets.add(itemset);
        }
        return itemsets;
    }
    //4



}
