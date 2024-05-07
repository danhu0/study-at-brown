package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.constants.Constants;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import edu.brown.cs.student.main.server.utils.Utils;
import edu.brown.cs.student.main.server.utils.VectorizedData;
import java.util.*;
import java.util.concurrent.ExecutionException;
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

  //    try
  //    {
  //      double[] thing = this.getUserTasteProfile("mock-user");
  //      for(double thinG: thing) {
  //        System.out.print(thinG+", ");
  //      }
  //      System.out.println();
  //    }
  //    catch(Exception e){
  //      e.printStackTrace();
  //    }

  /**
   * Set up query vector for a request based on the included attributes specified in the Constants
   * class.
   *
   * <p>For included attributes not specified in the request, values are set to -1.
   *
   * @param request
   * @return double[] queryVector
   */
  private double[] getQueryVector(Request request) {
    double[] queryVector = new double[Constants.INCLUDED_ATTRIBUTES.size()];
    int i = 0;
    for (String attr : Constants.INCLUDED_ATTRIBUTES) { // only consider INCLUDED_ATTRIBUTES
      try {
        queryVector[i] = Double.parseDouble(request.queryParams(attr));
      } catch (Exception e) {
        queryVector[i] = -1.0;
      }
      i++;
    }
    return queryVector;
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
      // Sets up values vector
      double[] queryVector = this.getQueryVector(request);

      double[] originalVector = Utils.copyVector(queryVector);

      // combine with user taste profile if the user is signed in
      final boolean signedIn = request.queryParams().contains("uid");
      if (request.queryParams().contains("uid")) {
        String uid = request.queryParams("uid");
        double[] userPrefsVector = this.getUserTasteProfile(uid);
        for (int j = 0; j < queryVector.length - 1; j++) {
          if (queryVector[j]
              == -1.0) { // update the queryVector with info from taste profile for fields left
            // empty
            queryVector[j] = userPrefsVector[j];
          }
        }
      }

      // Call the cosine similarity and get a list of most similar
      Comparator<double[]> comparator =
          new Comparator<double[]>() {
            @Override
            public int compare(double[] spot1, double[] spot2) {
              double cosine1, cosine2;
              // if not signed in, replace queryVector with identical vector with -1s info from spot
              // so that those attributes don't affect the cosine val
              if (!signedIn) {
                cosine1 = Utils.cosineSimilarity(Utils.matchNegatives(queryVector, spot1), spot1);
                cosine2 = Utils.cosineSimilarity(Utils.matchNegatives(queryVector, spot2), spot2);
              } else {
                cosine1 = Utils.cosineSimilarity(queryVector, spot1);
                cosine2 = Utils.cosineSimilarity(queryVector, spot2);
              }
              return -Double.compare(cosine1, cosine2);
            }
          };

      // priority queue is sorted in order of spots' cosine similarity to query vector
      PriorityQueue<double[]> pq = new PriorityQueue<>(comparator);
      for (double[] vector : this.data.vectorToData().keySet()) {
        // calc a vector's cosine sim
        pq.offer(vector);
      }

      // Allow param num_spots to request a specific number of spots
      int num_spots = Constants.NUM_SPOTS_TO_RETURN;
      if (request.queryParams().contains("num_spots")) {
        num_spots =
            Math.min(
                Integer.parseInt(request.queryParams("num_spots")),
                this.data
                    .idsToVector()
                    .keySet()
                    .size()); // make sure it does not exceed max num spots
      }

      // Put that shit in the response map
      List<Map<String, String>> bestSpots = new ArrayList<>();
      List<Map<String, String>> rejects = new ArrayList<>();
      while (bestSpots.size() < num_spots) {
        if (!pq.isEmpty()) {
          double[] bestVec = pq.poll(); // get most recommended vector
          Map<String, String> recordMap = this.data.vectorToData().get(bestVec).toMap();
          if (this.satisfiesOriginalVector(originalVector, bestVec)) {
            bestSpots.add(recordMap); // if it satisfies search query, add to recs
          } else {
            rejects.add(recordMap); // else, add to rejects
          }
        } else { // if fewer than NUM_SPOTS_TO_RETURN spots perfectly satisfy search, dip into
          // rejects
          bestSpots.add(rejects.remove(0));
        }
      }
      System.out.println("bestspots: " + bestSpots.toString() + "\n");
      System.out.println("query vector: " + queryVector.toString() + "\n");
      System.out.println("request: " + request.toString() + "\n");

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
   * Helper method to ensure that a recommended vector satisfies the query criteria.
   *
   * @param originalVector double[] vector with positive values for specified params and -1 else
   * @param recommendedVector double[] vector corresponding to a recommended study spot
   * @return false if recommendedVector does not match one of the requested params, else true
   */
  private boolean satisfiesOriginalVector(double[] originalVector, double[] recommendedVector) {
    assert (originalVector.length == recommendedVector.length);
    for (int j = 0; j < originalVector.length; j++) {
      if (originalVector[j] != -1.0) { // if not -1, then was a value specified by user query
        if (originalVector[j] != recommendedVector[j]) {
          return false; // if not matching original vector, doesn't satisfy request
        }
      }
    }
    return true;
  }

  /**
   * Helper method for generating a vector representing the tastes/preferences of a given user. If
   * the user has no saved spots, their taste vector will be [-1,-1,...,-1]
   *
   * @param uid
   * @return taste profile vector length = Constants.INCLUDED_ATTRIBUTES.size()
   * @throws Exception
   */
  public double[] getUserTasteProfile(String uid) throws InterruptedException, ExecutionException {
    // get all the spots for the user
    List<Map<String, Object>> vals = this.storageHandler.getCollection(uid, "saved-spots");

    // convert the key,value map to just a list of the spots.
    //    List<String> spots = vals.stream().map(spot -> spot.get("name").toString()).toList();
    List<Integer> spots =
        vals.stream().map(spot -> Integer.parseInt(spot.get("id").toString())).toList();

    // if user has no saved spots, return vector full of -1s
    if (spots.isEmpty()) {
      double values[] = new double[Constants.INCLUDED_ATTRIBUTES.size()];
      for (int i = 0; i < Constants.INCLUDED_ATTRIBUTES.size(); i++) {
        values[i] = -1;
      }
      return values;
    }

    // sum up all the spot vectors
    double averageTasteProfile[] = new double[Constants.INCLUDED_ATTRIBUTES.size()];
    for (int i = 0; i < spots.size(); i++) {
      for (int j = 0; j < Constants.INCLUDED_ATTRIBUTES.size(); j++) {
        //        double spotVector[] = this.data.nameToVector().get(spots.get(i));
        double spotVector[] = this.data.idsToVector().get(spots.get(i));
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
