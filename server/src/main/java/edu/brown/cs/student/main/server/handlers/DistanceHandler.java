package edu.brown.cs.student.main.server.handlers;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.squareup.moshi.JsonAdapter;
import com.squareup.moshi.Moshi;
import com.squareup.moshi.Types;
import edu.brown.cs.student.main.server.handlers.GoogleMapsResponse.Row;
import edu.brown.cs.student.main.server.utils.Utils;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.lang.reflect.Type;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/** Handler class from the broadband endpoint. */
public class DistanceHandler implements Route {

  /** Default constructor for the BroadbandHandler. Takes no arguments. */
  public DistanceHandler() {}

  /**
   * Method which handles the user's request and is called when the API endpoint is accessed. This
   * takes in the user's request, parses out its parameters, and then passes the params forward to
   * the Datasource class to get back a response from the API. It gets a JSON back from Datasource,
   * deserializes it to format the JSON, puts it in a response map, then appends a time stamp onto
   * the response map. This map of the responses is then returned.
   *
   * @param request - The user's query request
   * @param response - The response to the user's query
   * @return - the responseMap, a Map between strings and objects containing the API's response
   */
  @Override
  public Object handle(Request request, Response response) {

    String currentLat = request.queryParams("current_lat");
    String currentLong = request.queryParams("current_long");
    String targetLat = request.queryParams("target_lat");
    String targetLong = request.queryParams("target_long");

    Map<String, Object> responseMap = new HashMap<>();
    try {
      responseMap.put("response_type", "success");
      responseMap.put(
          "distance", getMoshiAdapter(sendRequest(currentLat, currentLong, targetLat, targetLong)));

    } catch (Exception e) {
      // error likely occurred in the storage handler
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }
    return Utils.toMoshiJson(responseMap);
  }

  /**
   * Helper method which sends an API request given a parameter and a location (county or state).
   *
   * @param get the parameter to get
   * @param location a county or a state
   * @return returns the body of the response; a json
   * @throws URISyntaxException if the given string violates RFC 2396
   * @throws IOException if HttpRequest cannot be sent
   * @throws InterruptedException if sending of HttpRequest is interrupted
   */
  public static String sendRequest(
      String currentLat, String currentLong, String targetLat, String targetLong)
      throws URISyntaxException, IOException, InterruptedException {
    HttpRequest buildCensusApiRequest =
        HttpRequest.newBuilder()
            .uri(
                new URI(
                    "https://maps.googleapis.com/maps/api/distancematrix/json?destinations="
                        + targetLat
                        + "%2C"
                        + targetLong
                        + "&mode=walking&origins="
                        + currentLat
                        + "%2C"
                        + currentLong
                        + "&units=imperial&key="
                        + getAPIKey()))
            .GET()
            .build();
    // Send that API request then store the response in this variable. Note the generic type.
    HttpResponse<String> sentCensusApiResponse =
        HttpClient.newBuilder()
            .build()
            .send(buildCensusApiRequest, HttpResponse.BodyHandlers.ofString());

    return sentCensusApiResponse.body();
  }

  /**
   * Helper method which returns a moshi adapter, or a list of a list of strings, which essentially
   * parses the json into a useful data structure.
   *
   * @param jsonList the raw json data from the Census API
   * @return a List of a List of Strings
   * @throws IOException if the json is invalid
   */
  public static GoogleMapsResponse getMoshiAdapter(String jsonList) throws IOException {
    Moshi moshi = new Moshi.Builder().build();

    Type listType = Types.newParameterizedType(GoogleMapsResponse.class, Row.class);
    JsonAdapter<GoogleMapsResponse> adapter = moshi.adapter(listType);

    return adapter.fromJson(jsonList);
  }

  private static String getAPIKey() throws FileNotFoundException {
    String workingDirectory = System.getProperty("user.dir");
    Path googleMapsConfigPath =
        Paths.get(workingDirectory, "src", "main", "resources", "google_maps_config.json");

    FileReader fr = new FileReader(googleMapsConfigPath.toString());

    Gson gson = new Gson();
    JsonObject json = gson.fromJson(fr, JsonObject.class);

    return json.get("google_maps_key").getAsString();
  }
}
