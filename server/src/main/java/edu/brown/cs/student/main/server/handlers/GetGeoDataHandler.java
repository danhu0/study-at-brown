package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.Utils;
import edu.brown.cs.student.main.server.parserNestedClasses.GeoJsonSharedState;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * Handler for get-geodata endpoint. Accesses the data through the injected GeoJsonSharedState
 * object. Ensures no parameters entered.
 */
public class GetGeoDataHandler implements Route {
  private final GeoJsonSharedState geojson;

  /**
   * Constructor
   *
   * @param geojson
   */
  public GetGeoDataHandler(GeoJsonSharedState geojson) {
    this.geojson = geojson;
  }

  /**
   * Invoked when a request is made on this route's corresponding path e.g. '/hello'
   *
   * @param request The request object providing information about the HTTP request
   * @param response The response object providing functionality for modifying the response
   * @return The content to be set in the response
   */
  @Override
  public Object handle(Request request, Response response) throws Exception {
    Map<String, Object> responseMap = new HashMap<>();
    if (!request.queryParams().isEmpty()) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", "there are no parameters for the get-geodata endpoint");
    } else {
      responseMap.put("response_type", "success");
      responseMap.put("result", this.geojson.getGeojson());
    }
    return Utils.toMoshiJson(responseMap);
  }
}
