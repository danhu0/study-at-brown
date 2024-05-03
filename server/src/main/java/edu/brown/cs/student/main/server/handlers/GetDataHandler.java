package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.Utils;
import edu.brown.cs.student.main.server.VectorizedData;
import java.util.HashMap;
import java.util.Map;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetDataHandler implements Route {
  private VectorizedData data;

  public GetDataHandler(VectorizedData data) {
    this.data = data;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    Map<String, Object> responseMap = new HashMap<>();

    try {
<<<<<<< HEAD
      String requestedName = request.queryParams("name");
      double[] vector = this.data.nameToVector().get(requestedName);
=======
      //            String requestedName = request.queryParams("name");
      //            double[] vector = this.data.nameToVector().get(requestedName);
      int requestedName = Integer.parseInt(request.queryParams("id"));
      double[] vector = this.data.idsToVector().get(requestedName);
>>>>>>> f9fa68b711fd263f8ac306b333517cdc348cf51f
      Map<String, String> returnData = this.data.vectorToData().get(vector).toMap();
      responseMap.put("response_type", "success");
      responseMap.put("best_spots", returnData);
    } catch (Exception e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }
    return Utils.toMoshiJson(responseMap);
  }
}
