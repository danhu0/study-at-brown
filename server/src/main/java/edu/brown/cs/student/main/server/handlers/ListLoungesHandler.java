package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/**
 * Lists all pins stored in the Firebase for the user. Used for loading the pin markers on a new
 * session with all the stored coordinates.
 */
public class ListLoungesHandler implements Route {

  public StorageInterface storageHandler;

  public ListLoungesHandler(StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
  }

  /**
   * Invoked when a request is made on this route's corresponding path e.g. '/hello'
   *
   * @param request The request object providing information about the HTTP request
   * @param response The response object providing functionality for modifying the response
   * @return The content to be set in the response
   */
  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    try {
      String uid = request.queryParams("uid");

      System.out.println("listing lounges for user: " + uid);

      // get all the pins for the user
      List<Map<String, Object>> vals = this.storageHandler.getCollection(uid, "lounges");

      // convert the key,value map to just a list of the pins.
      List<Map<String, Float>> lounges =
          vals.stream()
              .map(
                  lounge -> {
                    Map<String, Float> tempLounge = new HashMap<>();

                    // tempLounge.put("title", Float.parseFloat(lounge.get("title").toString()));
                    // tempLounge.put(
                    //     "description", Float.parseFloat(lounge.get("description").toString()));
                    // tempLounge.put(
                    //     "attributes", Float.parseFloat(lounge.get("attributes").toString()));
                    // tempLounge.put(
                    //     "google_link", Float.parseFloat(lounge.get("google_link").toString()));
                    // tempLounge.put("images", Float.parseFloat(lounge.get("images").toString()));
                    return tempLounge;
                  })
              .toList();

      responseMap.put("response_type", "success");
      responseMap.put("lounges", lounges);
    } catch (Exception e) {
      // error likely occurred in the storage handler
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
