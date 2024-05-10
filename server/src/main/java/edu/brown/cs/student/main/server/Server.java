package edu.brown.cs.student.main.server;

import static spark.Spark.after;

import edu.brown.cs.student.main.server.constants.Constants;
import edu.brown.cs.student.main.server.handlers.*;
import edu.brown.cs.student.main.server.storage.FirebaseUtilities;
import edu.brown.cs.student.main.server.storage.MockedUtilities;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import edu.brown.cs.student.main.server.utils.Utils;
import edu.brown.cs.student.main.server.utils.VectorizedData;
import java.io.IOException;
import spark.Filter;
import spark.Spark;

/** Top Level class for our project, utilizes spark to create and maintain our server. */
public class Server {
  public static void setUpServer(boolean mock) {
    int port = 3232;
    Spark.port(port);

    after(
        (Filter)
            (request, response) -> {
              response.header("Access-Control-Allow-Origin", "*");
              response.header("Access-Control-Allow-Methods", "*");
            });

    VectorizedData data = null;
    try {
      data =
          Utils.convertCSVToVectors(Constants.STUDY_SPOT_DATA_PATH, Constants.INCLUDED_ATTRIBUTES);
    } catch (IOException e) {
      e.printStackTrace();
      System.err.println(
          "Error: Could not vectorize data. Likely due to study_spots.csv not being found. Exiting.");
      System.exit(1);
    }

    StorageInterface firebaseUtils;
    try {
      if (!mock) firebaseUtils = new FirebaseUtilities();
      else firebaseUtils = new MockedUtilities();

      // Add endpoints
      Spark.get("add-lounge", new AddLoungeHandler(firebaseUtils));
      //      Spark.get("list-lounges", new ListLoungesHandler(firebaseUtils));
      Spark.get("clear-user", new ClearUserHandler(firebaseUtils));

      Spark.get("get-user", new GetUserDataHandler(firebaseUtils, data));
      Spark.get("get-recs", new GetRecsHandler(firebaseUtils, data));
      Spark.get("get-hot", new HOTStudyHandler(data));
      Spark.get("get-data", new GetDataHandler(data));
      Spark.get("get-distance", new DistanceHandler());
      Spark.get("get-reviews", new GetReviewsHandler(firebaseUtils));
      Spark.get("add-review", new AddReviewHandler(firebaseUtils));
      Spark.get("is-favorited", new UserFavoritedHandler(firebaseUtils));

      Spark.notFound(
          (request, response) -> {
            response.status(404); // Not Found
            System.out.println("ERROR");
            return "404 Not Found - The requested endpoint does not exist.";
          });
      Spark.init();
      Spark.awaitInitialization();

      System.out.println("Server started at http://localhost:" + port);
    } catch (IOException e) {
      e.printStackTrace();
      System.err.println(
          "Error: Could not initialize Firebase. Likely due to firebase_config.json not being found. Exiting.");
      System.exit(1);
    }
  }

  /**
   * Runs Server.
   *
   * @param args none
   */
  public static void main(String[] args) {
    setUpServer(true);
  }
}
