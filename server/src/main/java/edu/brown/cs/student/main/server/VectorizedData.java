package edu.brown.cs.student.main.server;

import java.util.Map;
import org.apache.commons.csv.CSVRecord;

public record VectorizedData(
    //    Map<double[], CSVRecord> vectorToData, Map<String, double[]> nameToVector) {}
    Map<double[], CSVRecord> vectorToData, Map<Integer, double[]> idsToVector) {}
