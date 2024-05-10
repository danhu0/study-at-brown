package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import edu.brown.cs.student.main.server.utils.Utils;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class UserFavoritedHandler implements Route {
  private StorageInterface storageHandler;

  public UserFavoritedHandler(StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    Map<String, Object> responseMap = new HashMap<>();
    try {
      String uid = request.queryParams("uid");
      int loungeid = Integer.parseInt(request.queryParams("spot-id"));
      System.out.println(
          "checking whether lounge (" + loungeid + ") is favorited for user: " + uid);

      // get all the spots for the user
      List<Map<String, Object>> vals = this.storageHandler.getCollection(uid, "saved-spots");

      Boolean isFavorited = false;
      // convert the key,value map to just a list of the spots.
      //      List<String> spots = vals.stream().map(spot -> spot.get("name").toString()).toList();
      List<Integer> spots =
          vals.stream().map(spot -> Integer.parseInt(spot.get("id").toString())).toList();
      for (int spotId : spots) {
        if (loungeid == spotId) {
          isFavorited = true;
        }
      }
      responseMap.put("response_type", "success");
      responseMap.put("isFavorited", isFavorited);
    } catch (Exception e) {
      // error likely occurred in the storage handler
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
