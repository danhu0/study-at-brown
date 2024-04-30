package edu.brown.cs.student.main.server;

import static spark.Spark.after;

import edu.brown.cs.student.main.server.datasource.GeoDatasource;
import edu.brown.cs.student.main.server.handlers.*;
import edu.brown.cs.student.main.server.parserNestedClasses.GeoJsonSharedState;
import edu.brown.cs.student.main.server.storage.FirebaseUtilities;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import java.io.IOException;
import spark.Filter;
import spark.Spark;

/** Top Level class for our project, utilizes spark to create and maintain our server. */
public class Server {

  public static void setUpServer() {
    int port = 3232;
    Spark.port(port);

    after(
        (Filter)
            (request, response) -> {
              response.header("Access-Control-Allow-Origin", "*");
              response.header("Access-Control-Allow-Methods", "*");
            });

    StorageInterface firebaseUtils;
    try {
      firebaseUtils = new FirebaseUtilities();
      // Add endpoints
      Spark.get("add-lounge", new AddLoungeHandler(firebaseUtils));
      Spark.get("list-lounges", new ListLoungesHandler(firebaseUtils));
      Spark.get("clear-user", new ClearUserHandler(firebaseUtils));

      GeoJsonSharedState sharedState = new GeoJsonSharedState();
      Spark.get("set-geodata", new SetGeoDataHandler(new GeoDatasource(), sharedState));
      Spark.get("get-geodata", new GetGeoDataHandler(sharedState));

      Spark.get("get-user", new GetUserDataHandler(firebaseUtils));
      Spark.get("get-recs", new GetRecsHandler());

      // mocked verison of set-geodata, for testing only
      // Spark.get("set-geodata", new SetGeoDataHandler(new MockDataSource(),
      // sharedState));

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
    setUpServer();
  }
}
