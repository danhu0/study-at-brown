package edu.brown.cs.student.main.server.parserNestedClasses;

import com.squareup.moshi.Moshi;
import java.util.List;
import java.util.Map;

/**
 * This class represents the GeoJSON data - it contains a list of features, and each feature
 * contains a type, a geometry (a huge list of coordinates), and a list of properties. Each list of
 * properties contains a name, a holc grade, and a hashmap of area description data, along other
 * properties.
 */
public class GeoJsonObject {
  public String type;
  public List<Feature> features;

  public static class Feature {
    public String type;
    public Geometry geometry;
    public Properties properties;
  }

  public static class Geometry {
    public String type;
    public List<List<List<List<Double>>>> coordinates;
  }

  public static class Properties {
    public String city;
    public String holc_grade;
    public Map<String, String> area_description_data;
  }

  /**
   * Serializes the json as a string
   *
   * @return
   */
  public String serialize() {
    Moshi moshi = new Moshi.Builder().build();
    return moshi.adapter(GeoJsonObject.class).toJson(this);
  }
}
