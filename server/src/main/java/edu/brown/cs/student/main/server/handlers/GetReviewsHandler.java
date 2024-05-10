package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import edu.brown.cs.student.main.server.utils.Utils;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/** Endpoint add-pin for adding pins to the Firebase database. Takes lat and long as parameters. */
public class GetReviewsHandler implements Route {

  public StorageInterface storageHandler;

  public GetReviewsHandler(StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
  }

  /**
   * Invoked when a request is made on this route's corresponding path e.g. '/hello'
   *
   * <p>Request params: uid = user ID, spot-id = id corresponding to spot to be saved
   *
   * @param request The request object providing information about the HTTP request
   * @param response The response object providing functionality for modifying the response
   * @return The content to be set in the response
   */
  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    try {
      // collect parameters from the request
      //      String lounge = request.queryParams("lounge");
      int id = Integer.parseInt(request.queryParams("spot-id"));
      //      System.out.println(lounge);
      Map<String, Object> data = new HashMap<>();

      data.put("id", id);
      // get the current word count to make a unique word_id by index.
      // System.out.println(this.storageHandler.getCollection(uid, "saved-spots").);
      // get all the spots for the user
      List<Map<String, Object>> vals =
          this.storageHandler.getCollection("reviews", "spot-" + id + "-reviews");

      // convert the key,value map to just a list of the spots.
      //      List<String> spots = vals.stream().map(spot -> spot.get("name").toString()).toList();
      //   List<Integer> spots =
      //       vals.stream().map(spot -> Integer.parseInt(spot.get("id").toString())).toList();
      responseMap.put("response_type", "success");
      responseMap.put("reviews", vals);
    } catch (Exception e) {
      // error likely occurred in the storage handler
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
