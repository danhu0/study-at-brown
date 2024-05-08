package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.storage.StorageInterface;
import edu.brown.cs.student.main.server.utils.Utils;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

/** Endpoint add-pin for adding pins to the Firebase database. Takes lat and long as parameters. */
public class AddReviewHandler implements Route {

  public StorageInterface storageHandler;

  public AddReviewHandler(StorageInterface storageHandler) {
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
      String uid = request.queryParams("uid");
      int id = Integer.parseInt(request.queryParams("spot-id"));
      String review = request.queryParams("review");
      Map<String, Object> data = new HashMap<>();

      data.put("review", review);
      data.put("uid", uid);
      // get the current word count to make a unique word_id by index.
      // System.out.println(this.storageHandler.getCollection(uid, "saved-spots").);
      String loungeID = "spot-" + id;

      // if (this.storageHandler.getCollection(uid, "saved-spots").contains(id)) {
      // System.out.println("Lounge " + id + " already added to user preferences");
      // // this.storageHandler.getCollection(uid, "saved-spots").remove(loungeID);

      // responseMap.put("spot", data);
      // responseMap.put("response_type", "success");
      // return Utils.toMoshiJson(responseMap);
      // }

      System.out.println("adding review: (" + review + ") for user: " + uid);
      // use the storage handler to add the document to the database
      this.storageHandler.addDocument("reviews", loungeID, loungeID + "-reviews", data);

      responseMap.put("response_type", "success");
      responseMap.put("review", data);
      responseMap.put("spot-id", id);
    } catch (Exception e) {
      // error likely occurred in the storage handler
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }

    return Utils.toMoshiJson(responseMap);
  }
}
