package edu.brown.cs.student.main.server.parserNestedClasses;

/**
 * Shared state to be used for dependency injection to sync up stored data across the set and get
 * geodata handlers. Constructor initializes to store the full geoJSON with all the zoning data.
 *
 * <p>GeoJSON stored as a string
 */
public class GeoJsonSharedState {
  private String geojson;

  public GeoJsonSharedState() {
    JSONParser2 parser = new JSONParser2();
    parser.createGeoJson();
    GeoJsonObject geoJson = parser.getParsedJSON();

    this.geojson = geoJson.serialize();
  }

  /**
   * Getter for GeoJSON
   *
   * @return String
   */
  public String getGeojson() {
    return geojson;
  }

  /**
   * Set geojson to a new value
   *
   * @param geojson
   */
  public void setGeojson(String geojson) {
    this.geojson = geojson;
  }
}
