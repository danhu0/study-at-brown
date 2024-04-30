package edu.brown.cs.student.main.server;

import org.apache.commons.csv.CSVRecord;

import java.util.Map;

public record VectorizedData(Map<double[], CSVRecord> vectorToData,
        Map<String, double[]> nameToVector) {
}