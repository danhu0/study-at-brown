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
public class ListPinsHandler implements Route {

  public StorageInterface storageHandler;

  public ListPinsHandler(StorageInterface storageHandler) {
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

      System.out.println("listing pins for user: " + uid);

      // get all the pins for the user
      List<Map<String, Object>> vals = this.storageHandler.getCollection(uid, "pins");

      // convert the key,value map to just a list of the pins.
      List<Map<String, Float>> pins =
          vals.stream()
              .map(
                  pin -> {
                    Map<String, Float> tempPin = new HashMap<>();
                    tempPin.put("lat", Float.parseFloat(pin.get("lat").toString()));
                    tempPin.put("long", Float.parseFloat(pin.get("long").toString()));
                    return tempPin;
                  })
              .toList();

      responseMap.put("response_type", "success");
      responseMap.put("pins", pins);
    } catch (Exception e) {
      // error likely occurred in the storage handler
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
