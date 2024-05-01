package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.Utils;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetUserDataHandler implements Route {
  public StorageInterface storageHandler;

  public GetUserDataHandler(StorageInterface storageHandler) {
    this.storageHandler = storageHandler;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    Map<String, Object> responseMap = new HashMap<>();
    try {
      String uid = request.queryParams("uid");

      System.out.println("listing spots for user: " + uid);

      // get all the spots for the user
      List<Map<String, Object>> vals = this.storageHandler.getCollection(uid, "saved-spots");

      // convert the key,value map to just a list of the spots.
//      List<String> spots = vals.stream().map(spot -> spot.get("name").toString()).toList();
      List<Integer> spots = vals.stream().map(spot -> Integer.parseInt(spot.get("id").toString())).toList();

      responseMap.put("response_type", "success");
      responseMap.put("saved-spots", spots);
    } catch (Exception e) {
      // error likely occurred in the storage handler
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
