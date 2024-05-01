package edu.brown.cs.student.main.server;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;
import java.lang.reflect.Type;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.commons.math3.linear.ArrayRealVector;
import org.apache.commons.math3.linear.RealVector;

public class Utils {

  public static String toMoshiJson(Map<String, Object> map) {
    Moshi moshi = new Moshi.Builder().build();
    Type mapStringObject = Types.newParameterizedType(Map.class, String.class, Object.class);
    JsonAdapter<Map<String, Object>> adapter = moshi.adapter(mapStringObject);

    return adapter.toJson(map);
  }

  /**
   * Computes and returns the cosine similarity of two vectors inputted as arrays of doubles.
   *
   * @param vectorA
   * @param vectorB
   * @return cosine similarity bounded between [-1,1], where 1 means the vectors point exactly in
   *     the same direction, and -1 means they point in opposite directions
   */
  public static double cosineSimilarity(double[] vectorA, double[] vectorB) {
    // Convert arrays to RealVector objects
    RealVector a = new ArrayRealVector(vectorA);
    RealVector b = new ArrayRealVector(vectorB);

    // Calculate cosine similarity
    return a.dotProduct(b) / (a.getNorm() * b.getNorm());
  }

  /**
   * Takes in a filepath to a CSV with headers and a list of desired columns.
   *
   * @param filePath - path to csv
   * @param attributesToInclude - list of desired columns to include
   * @return a VectorizedData with the CSV parsed into 2 maps that link arrays of doubles and the
   *     CSVRecord of corresponding study spot and of spot names to vector data
   * @throws IOException
   * @throws NumberFormatException - CSV must only contain headers and numbers in the desired
   *     columns
   */
  public static VectorizedData convertCSVToVectors(
      String filePath, List<String> attributesToInclude) throws IOException, NumberFormatException {
    Map<double[], CSVRecord> vectorsToData = new HashMap<>();
//    Map<String, double[]> namesToVector = new HashMap<>();
    Map<Integer, double[]> idsToVector = new HashMap<>();

    // Open the CSV file for reading
    try (Reader reader = new FileReader(filePath);
        CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withHeader())) {

      // Iterate over each record (row) in the CSV file
      for (CSVRecord csvRecord : csvParser) {

        // Assuming all columns except the last one are numerical data
        double[] values = new double[Constants.INCLUDED_ATTRIBUTES.size()];
        //        System.out.println(csvRecord);

        // Convert each column value to double
        int i = 0;
        for (String attr : Constants.INCLUDED_ATTRIBUTES) {
          values[i] = Double.parseDouble(csvRecord.get(attr));
          i++;
        }
        //        for(double d : values) {
        //          System.out.print(d+", ");
        //        }
        //        System.out.println();
//        namesToVector.put(csvRecord.get("name"), values); //changing to id triggers error
        idsToVector.put(Integer.parseInt(csvRecord.get("id")), values); //changing to id triggers error
        vectorsToData.put(values, csvRecord);
      }

    } catch (NumberFormatException e) {
      throw new NumberFormatException(e.getMessage());
    }

//    return new VectorizedData(vectorsToData, namesToVector);
    return new VectorizedData(vectorsToData, idsToVector);
  }

  /**
   * Takes in a query vector. If it has -1.0 values, they are replaced
   * with the corresponding value in the spot vector.
   * @param query
   * @param spot
   * @return new query vector (double[]) with negatives replaced
   */
  public static double[] matchNegatives(double[] query, double[] spot) {
    assert(query.length == spot.length);
    double newQ[] = new double[query.length];
    for(int i = 0; i < query.length; i++) {
      newQ[i] = query[i];
      if(query[i] == -1.0) {
        newQ[i] = spot[i];
      }
    }
    return newQ;
  }

  /**
   * Deep copy of a double[] vector
   * @param vector to be copied
   * @return copy of original vector
   */
  public static double[] copyVector(double[] vector) {
    double[] newVector = new double[vector.length];
    for(int i = 0; i < vector.length; i++) {
      newVector[i] = vector[i];
    }
    return newVector;
  }
}
