package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.Constants;
import edu.brown.cs.student.main.server.Utils;
import edu.brown.cs.student.main.server.VectorizedData;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.util.*;
import org.apache.commons.csv.CSVRecord;
import spark.Request;
import spark.Response;
import spark.Route;

public class GetRecsHandler implements Route {

  private VectorizedData data;
  private StorageInterface storageHandler;

  public GetRecsHandler(StorageInterface storageHandler, VectorizedData data) {
    this.data = data;
    this.storageHandler = storageHandler;
  }

  /**
   * Handle method for the endpoint. This converts the user's API query into a vector, puts them
   * into a priority queue that sorts them based on their cosine similarity then pops the best
   * vectors off the queue
   *
   * @param request The request object providing information about the HTTP request
   * @param response The response object providing functionality for modifying the response
   * @return
   */
  @Override
  public Object handle(Request request, Response response) {
    Map<String, Object> responseMap = new HashMap<>();
    try {
//      Set<String> querySet = request.queryParams();

      // Sets up values vector
      double[] queryVector = new double[Constants.INCLUDED_ATTRIBUTES.size()];
      int i = 0;
      for (String attr : Constants.INCLUDED_ATTRIBUTES) {
        try {
          queryVector[i] = Double.parseDouble(request.queryParams(attr));
        } catch (Exception e) {
          queryVector[i] = -1.0;
        }
        i++;
      }

      // Call the cosine similarity and get a list of most similar
      Comparator<double[]> comparator =
          new Comparator<double[]>() {
            @Override
            public int compare(double[] spot1, double[] spot2) {
              double cosine1 = Utils.cosineSimilarity(queryVector, spot1);
              double cosine2 = Utils.cosineSimilarity(queryVector, spot2);
              return -Double.compare(cosine1, cosine2);
            }
          };

      PriorityQueue<double[]> pq = new PriorityQueue<>(comparator);
      for (double[] vector : this.data.vectorToData().keySet()) {
        // calc a vector's cosine sim
        pq.offer(vector);
      }

      // Put that shit in the response map
      List<CSVRecord> bestSpots = new ArrayList<>();
      while (bestSpots.size() < 3) {
        double[] bestVec = pq.poll();
        CSVRecord record = this.data.vectorToData().get(bestVec);
        bestSpots.add(record);
      }
      responseMap.put("response_type", "success");
      responseMap.put("best_spots", bestSpots);
    } catch (Exception e) {
      // error likely occurred in the storage handler
      e.printStackTrace();
      responseMap.put("response_type", "failure");
      responseMap.put("error", e.getMessage());
    }
    return Utils.toMoshiJson(responseMap);
  }

  /**
   * Helper method for generating a vector representing the tastes/preferences of a given user. If
   * the user has no saved spots, their taste vector will be [-1,-1,...,-1]
   *
   * @param uid
   * @return taste profile vector length = Constants.INCLUDED_ATTRIBUTES.size()
   * @throws Exception
   */
  private double[] getUserTasteProfile(String uid) throws Exception {
    // get all the spots for the user
    List<Map<String, Object>> vals = this.storageHandler.getCollection(uid, "saved-spots");

    // convert the key,value map to just a list of the spots.
    List<String> spots = vals.stream().map(spot -> spot.get("name").toString()).toList();

    // if user has no saved spots, return vector full of -1s
    if (spots.isEmpty()) {
      double values[] = new double[Constants.INCLUDED_ATTRIBUTES.size()];
      for (int i = 0; i < Constants.INCLUDED_ATTRIBUTES.size(); i++) values[i] = -1;
      return values;
    }

    // sum up all the spot vectors
    double averageTasteProfile[] = new double[Constants.INCLUDED_ATTRIBUTES.size()];
    for (int i = 0; i < spots.size(); i++) {
      for (int j = 0; j < Constants.INCLUDED_ATTRIBUTES.size(); j++) {
        double spotVector[] = this.data.nameToVector().get(spots.get(i));
        averageTasteProfile[j] += spotVector[j];
      }
    }

    // normalize by num spots
    for (int i = 0; i < averageTasteProfile.length; i++) {
      averageTasteProfile[i] /= spots.size();
    }

    return averageTasteProfile;
  }
}
