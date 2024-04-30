package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.CoordBounds;
import edu.brown.cs.student.main.server.Utils;
import edu.brown.cs.student.main.server.datasource.*;
import edu.brown.cs.student.main.server.parserNestedClasses.GeoJsonSharedState;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/** set-geodata endpoint handler. Takes a datasource and a GeoJsonSharedState dependency */
public class SetGeoDataHandler implements Route {

  private final Datasource datasource;
  private final GeoJsonSharedState geoJsonSharedState;

  public SetGeoDataHandler(Datasource datasource, GeoJsonSharedState geoJsonSharedState) {
    this.datasource = new CachedDatasource(datasource);
    this.geoJsonSharedState = geoJsonSharedState;
    //    this.datasource = datasource;
  }

  /**
   * Handles the API call to the set-geodata endpoint.
   *
   * <p>Parameters are either keyword or maxlat,maxlong,minlat,minlong Checks the validity of
   * arguments before querying the datasource Stores result in GeoJsonSharedState
   *
   * @param request The request object providing information about the HTTP request
   * @param response The response object providing functionality for modifying the response
   * @return
   */
  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    //     // Creates a hashmap to store the results of the request
    if (request.queryParams().isEmpty()) {
      try {
        // no params = return the whole geojson. send request with empty hashmap
        String result = this.datasource.sendRequest(new HashMap<>());
        responseMap.put("result", result);
        responseMap.put("result_type", "success");
        this.geoJsonSharedState.setGeojson(result);
      } catch (Exception e) {
        e.printStackTrace();
        responseMap.put("response_type", "failure");
        responseMap.put("error", e.getMessage());
      }
    } else {
      // if there are params, ensure they are the right fields
      if ((request.queryParams().contains("maxlat")
          && request.queryParams().contains("maxlong")
          && request.queryParams().contains("minlat")
          && request.queryParams().contains("minlong")
          && request.queryParams().size() == 4)) {
        try {
          Double maxlat = Double.parseDouble(request.queryParams("maxlat"));
          Double minlat = Double.parseDouble(request.queryParams("minlat"));
          Double maxlong = Double.parseDouble(request.queryParams("maxlong"));
          Double minlong = Double.parseDouble(request.queryParams("minlong"));

          // ensure param values are valid
          if (maxlat <= minlat
              || maxlong <= minlong
              || maxlong > 180.
              || minlong < -180.
              || maxlat > 90.
              || minlat < -90.) {
            responseMap.put("response_type", "failure");
            responseMap.put(
                "error",
                "bounding error. latitude must be between [-90, 90] and "
                    + "longitude must be between [-180,180]. max bounds must be above min bounds.");
          } else {
            HashMap<CoordBounds, Double> params = new HashMap<>();
            params.put(CoordBounds.MAXLAT, maxlat);
            params.put(CoordBounds.MAXLONG, maxlong);
            params.put(CoordBounds.MINLAT, minlat);
            params.put(CoordBounds.MINLONG, minlong);
            responseMap.put("params", params); // adding params to the response map --
            // if needed to convert to json to have
            // nested json, cast to Map<Object, String>
            try {
              String result = this.datasource.sendRequest(params);
              responseMap.put("result", result);
              responseMap.put("result_type", "success");
              this.geoJsonSharedState.setGeojson(result);
              responseMap.put("params", params); // adding params to the response map --
              // if needed to convert to json to have
              // nested json, cast to Map<Object, String>
            } catch (Exception e) {
              e.printStackTrace();
              responseMap.put("response_type", "failure");
              responseMap.put("error", e.getMessage());
            }
          }
        } catch (NumberFormatException e) {
          responseMap.put("response_type", "failure");
          responseMap.put("error", "all bounding box params must be real numbers");
          //          responseMap.put("params", request.queryMap());
        }
      } else if (request.queryParams().contains("keyword") && request.queryParams().size() == 1) {
        try {
          String params = request.queryParams("keyword");
          String result = this.datasource.sendRequest(params);
          responseMap.put("result", result);
          responseMap.put("result_type", "success");
          this.geoJsonSharedState.setGeojson(result);
          responseMap.put("params", params); // adding params to the response map --
          // if needed to convert to json to have
          // nested json, cast to Map<Object, String>
        } catch (Exception e) {
          e.printStackTrace();
          responseMap.put("response_type", "failure");
          responseMap.put("error", e.getMessage());
        }
      } else {
        responseMap.put("response_type", "failure");
        responseMap.put(
            "error",
            "incorrect parameters. required parameter: either none (no bounding box, or "
                + "maxlat, maxlong, minlat, minlong");
      }
    }
    return Utils.toMoshiJson(responseMap);
  }
}
