package edu.brown.cs.student.main.server.parserNestedClasses;

import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class JSONParser2 {
  GeoJsonObject parsedJSON;

  /**
   * Parses JSON data from a JsonReader and converts it to the specified target type.
   *
   * @param source The JsonReader containing the JSON data.
   * @param targetType The Class representing the target data type to convert the JSON to.
   * @param <T> The generic type of the target data.
   * @return An instance of the target data type parsed from the JSON.
   * @throws IOException if there's an error reading or parsing the JSON data.
   */
  public static <T> T fromJsonGeneral(String source, Class<T> targetType) throws IOException {
    Moshi moshi = new Moshi.Builder().build();
    JsonAdapter<T> adapter = moshi.adapter(targetType);
    //    source.setLenient(true);

    return adapter.fromJson(source);
  }

  public void createGeoJson() {
    String filePath =
        "src/main/java/edu/brown/cs/student/main/server/datasource/geodata/mappinginequality.json";
    try {
      // ***************** READING THE FILE *****************
      FileReader jsonReader = new FileReader(filePath);
      BufferedReader br = new BufferedReader(jsonReader);
      String fileString = "";
      String line = br.readLine();
      while (line != null) {
        fileString = fileString + line;
        line = br.readLine();
        System.out.println(line);
      }
      jsonReader.close();

      // ****************** CREATING THE ADAPTER **********
      this.parsedJSON = this.fromJsonGeneral(fileString, GeoJsonObject.class);

    } catch (IOException e) {
      System.out.println(e.getMessage());
    }
  }

  public GeoJsonObject getParsedJSON() {
    return parsedJSON;
  }

  public static void main(String[] args) {
    JSONParser2 myparser = new JSONParser2();
    myparser.createGeoJson();
  }
}
