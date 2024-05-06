package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.constants.Constants;
import edu.brown.cs.student.main.server.utils.Utils;
import edu.brown.cs.student.main.server.algorithm.VectorizedData;
import java.util.*;
import org.apache.commons.csv.CSVRecord;
import spark.Request;
import spark.Response;
import spark.Route;

public class HOTStudyHandler implements Route {
  private VectorizedData data;

  public HOTStudyHandler(VectorizedData data) {
    this.data = data;
  }

  private Set<Map<String, String>> getHotSpots(int numToGenerate) {
    Set<Map<String, String>> hotSet = new HashSet<>();
    List<CSVRecord> hotSpots = new ArrayList<>(this.data.vectorToData().values());
    Collections.shuffle(hotSpots);
    while (hotSet.size() < numToGenerate && !hotSpots.isEmpty()) {
      hotSet.add(hotSpots.remove(0).toMap());
    }

    return hotSet;
  }

  @Override
  public Object handle(Request request, Response response) throws Exception {
    Map<String, Object> responseMap = new HashMap<>();
    try {
      int n = Constants.NUM_SPOTS_TO_RETURN;
      if (request.queryParams().contains("num_spots"))
        n = Integer.parseInt(request.queryParams("num_spots"));
      Set<Map<String, String>> hotSpots = this.getHotSpots(n);
      List<Map<String, String>> returnList = new ArrayList<>(hotSpots);

      responseMap.put("response_type", "success");
      responseMap.put("best_spots", returnList);
    } catch (Exception e) {
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }
    return Utils.toMoshiJson(responseMap);
  }
}
