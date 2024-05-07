package edu.brown.cs.student.main.server.datasource;

import edu.brown.cs.student.main.server.constants.CoordBounds;
import edu.brown.cs.student.main.server.parserNestedClasses.GeoJsonObject;
import edu.brown.cs.student.main.server.parserNestedClasses.GeoJsonObject.Feature;
import edu.brown.cs.student.main.server.parserNestedClasses.GeoJsonObject.Properties;
import edu.brown.cs.student.main.server.parserNestedClasses.JSONParser2;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/** Datasource class which is responsible for handling sending requests to query APIs. */
public class GeoDatasource implements Datasource {

  public GeoDatasource() {}

  /**
   * Method to send a request to a given API. Packages a list of parameters into an API request,
   * sends the request, and then returns the results of the request.
   *
   * @param params - List of Strings representing the parameters of the query
   * @return String representation of the result of the API query
   */
  public String sendRequest(HashMap<CoordBounds, Double> params) {
    JSONParser2 myparser = new JSONParser2();
    myparser.createGeoJson();
    GeoJsonObject geoJson = myparser.getParsedJSON();

    List<Feature> removalList = new ArrayList<>();
    if (!params.isEmpty()) {
      for (Feature feature : geoJson.features) {
        if (feature.geometry == null) {
          continue;
        }
        for (List<Double> coords : feature.geometry.coordinates.get(0).get(0)) {
          if (!(coords.get(1) <= params.get(CoordBounds.MAXLAT)
              && coords.get(1) >= params.get(CoordBounds.MINLAT)
              && coords.get(0) <= params.get(CoordBounds.MAXLONG)
              && coords.get(0) >= params.get(CoordBounds.MINLONG))) {
            removalList.add(feature);
          }
        }
      }
    }

    for (Feature feature : removalList) {
      geoJson.features.remove(feature);
    }

    //    System.out.println(geoJson.features.size());
    return geoJson.serialize();
  }

  public String sendRequest(String keyword) {
    JSONParser2 myparser = new JSONParser2();
    myparser.createGeoJson();
    GeoJsonObject geoJson = myparser.getParsedJSON();

    List<Feature> removalList = new ArrayList<>();

    for (Feature feature : geoJson.features) {
      if (feature.properties == null) {
        removalList.add(feature);
      }
      Properties properties = feature.properties;
      keyword = keyword.toLowerCase();

      if (properties.city == null
          || properties.holc_grade == null
          || properties.area_description_data == null) {
        removalList.add(feature);
        continue;
      }

      String propertyString =
          properties.city.toLowerCase()
              + properties.holc_grade.toLowerCase()
              + properties.area_description_data.toString().toLowerCase();
      if (propertyString.contains(keyword)) {
        continue;
      }
      removalList.add(feature);
    }

    for (Feature feature : removalList) {
      geoJson.features.remove(feature);
    }

    //    System.out.println(geoJson.features.size());
    return geoJson.serialize();
  }
}
