package edu.brown.cs.student;

import static org.testng.AssertJUnit.assertEquals;

import edu.brown.cs.student.Broadband.BroadbandHandler;
import edu.brown.cs.student.Broadband.Datasources.StateCache;
import edu.brown.cs.student.Server.CSVHandling.LoadCSVHandler;
import edu.brown.cs.student.Server.CSVHandling.SearchCSVHandler;
import edu.brown.cs.student.Server.CSVHandling.SharedData;
import edu.brown.cs.student.Server.CSVHandling.ViewCSVHandler;
import edu.brown.cs.student.Server.Server;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;

public class TestHandlersNew {

  private SharedData sharedData;
  //  private static int port = 2222
  private Server server;

  @BeforeAll
  public static void setup_before_everything() {
    Spark.port(0);
    Logger.getLogger("").setLevel(Level.WARNING); // empty name = root logger
  }

  @BeforeEach
  public void setup() {
    startServer(new SharedData(new ArrayList<>(), new ArrayList<>()));
  }

  public void startServer(SharedData sd) {
    this.sharedData = sd;

    LoadCSVHandler loadCSVHandler = new LoadCSVHandler(sharedData);

    Spark.get("loadcsv", loadCSVHandler);
    Spark.get("viewcsv", new ViewCSVHandler(sharedData));
    Spark.get("searchcsv", new SearchCSVHandler(sharedData));
    Spark.get("broadband", new BroadbandHandler(new StateCache()));
    Spark.init();
    Spark.awaitInitialization();
  }

  @AfterEach
  public void teardown() {
    // Gracefully stop Spark listening on both endpoints after each test
    //    Spark.unmap("loadcsv");
    //    Spark.unmap("viewcsv");
    //    Spark.unmap("searchcsv");
    //    Spark.unmap("broadband");
    this.server = null;
    Spark.awaitStop(); // don't proceed until the server is stopped
  }

  private static HttpURLConnection tryRequest(String apiCall) throws IOException {
    URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();

    clientConnection.setRequestMethod("GET");

    clientConnection.connect();
    return clientConnection;
  }

  /**
   * testing whether handlers throw errors or not
   *
   * @throws IOException
   */
  @Test
  public void testLoadHandler() throws IOException {
    HttpURLConnection clientConnectionLoad =
        tryRequest("loadcsv?filename=/stars/ten-star.csv&columnheaders=true");
    // loading csv
    assertEquals(200, clientConnectionLoad.getResponseCode());
    InputStream inputStream = clientConnectionLoad.getInputStream();
    BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
    String output = reader.readLine();
    reader.close();
    inputStream.close();
    assertEquals(output, "/stars/ten-star.csv loaded successfully!");
    // invalid file name
    HttpURLConnection clientConnectionLoadInvalidFileName = tryRequest("loadcsv?filename=/star");
    assertEquals(200, clientConnectionLoadInvalidFileName.getResponseCode());
    InputStream inputStream2 = clientConnectionLoadInvalidFileName.getInputStream();
    BufferedReader reader2 = new BufferedReader(new InputStreamReader(inputStream2));
    String output2 = reader2.readLine();
    reader2.close();
    inputStream2.close();
    assertEquals(
        output2,
        "{\"response_type\":\"Error: Specified file not found in the protected data directory.\"}");
    // new data set, ri_income
    HttpURLConnection clientConnectionRI = tryRequest("loadcsv?filename=/census/ri_income.csv");
    assertEquals(200, clientConnectionRI.getResponseCode());
    InputStream inputStream3 = clientConnectionRI.getInputStream();
    BufferedReader reader3 = new BufferedReader(new InputStreamReader(inputStream3));
    String output3 = reader3.readLine();
    reader3.close();
    inputStream3.close();
    assertEquals(output3, "/census/ri_income.csv loaded successfully!");
    // no parameters, no file name
    HttpURLConnection clientConnectionNoFile = tryRequest("loadcsv");
    assertEquals(200, clientConnectionNoFile.getResponseCode());
    InputStream inputStream4 = clientConnectionNoFile.getInputStream();
    BufferedReader reader4 = new BufferedReader(new InputStreamReader(inputStream4));
    String output4 = reader4.readLine();
    reader4.close();
    inputStream4.close();
    assertEquals(output4, "{error_bad_request=no file name specified}");
  }

  @Test
  public void testViewHandler() throws IOException {
    HttpURLConnection clientConnectionLoader =
        tryRequest("loadcsv?filename=/stars/ten-star.csv&columnheaders=true");
    assertEquals(200, clientConnectionLoader.getResponseCode());
    // viewing csv
    HttpURLConnection clientConnectionFile = tryRequest("viewcsv");
    assertEquals(200, clientConnectionFile.getResponseCode());

    // searching object, found
    //    tryRequest("loadcsv?filename=/stars/ten-star.csv");

    HttpURLConnection clientConnectionSearch = tryRequest("searchcsv?object=Sol");
    assertEquals(200, clientConnectionSearch.getResponseCode());
    InputStream inputStream = clientConnectionSearch.getInputStream();
    BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
    String output = reader.readLine();
    reader.close();
    inputStream.close();
    assertEquals(
        output,
        "{\"searchedObject\":\"Sol\",\"responseMap\":{\"found rows\":[[\"0\",\"Sol\",\"0\",\"0\",\"0\"]],\"response_type\":\"'Sol' found in row 0: [0, Sol, 0, 0, 0]\"}}");

    // searching object, not found
    HttpURLConnection clientConnectionSearch2 = tryRequest("searchcsv?object=NULL");
    assertEquals(200, clientConnectionSearch2.getResponseCode());
    // searching object, no parameters
    HttpURLConnection clientConnectionSearch3 = tryRequest("searchcsv?");
    assertEquals(200, clientConnectionSearch3.getResponseCode());
    // searching object, column out of bounds / invalid
    HttpURLConnection clientConnectionSearch4 = tryRequest("searchcsv?object=Sol&column=10");
    assertEquals(200, clientConnectionSearch4.getResponseCode());
    // searching object, column in bounds, found
    HttpURLConnection clientConnectionSearch5 = tryRequest("searchcsv?object=Sol&column=1");
    assertEquals(200, clientConnectionSearch5.getResponseCode());
    // searching object, column in bounds, not found
    HttpURLConnection clientConnectionSearch6 = tryRequest("searchcsv?object=Sol&column=0");
    assertEquals(200, clientConnectionSearch6.getResponseCode());
  }

  @Test
  public void testBroadbandHandler() throws IOException {
    // bad county
    HttpURLConnection clientBroadband = tryRequest("broadband?state=new+york&county=null");
    assertEquals(200, clientBroadband.getResponseCode());

    //    bad state
    HttpURLConnection clientBroadband2 =
        tryRequest("broadband?state=null&county=westchester+county");
    assertEquals(200, clientBroadband2.getResponseCode());

    // neither state nor county
    HttpURLConnection clientBroadband3 = tryRequest("broadband");
    assertEquals(200, clientBroadband3.getResponseCode());

    // no county
    HttpURLConnection clientBroadband4 = tryRequest("broadband?state=new+york");
    assertEquals(200, clientBroadband4.getResponseCode());

    // no state
    HttpURLConnection clientBroadband5 = tryRequest("broadband?county=westchester+county");
    assertEquals(200, clientBroadband5.getResponseCode());

    // good state
    HttpURLConnection clientBroadband6 =
        tryRequest("broadband?county=westchester+county&state=New+York");
    assertEquals(200, clientBroadband5.getResponseCode());
    InputStream inputStream = clientBroadband6.getInputStream();
    BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
    String output = reader.readLine();
    reader.close();
    inputStream.close();
    assertEquals(
        output,
        "NoBroadbandDataStateResponse[invalid_state=state not found, state=new york, responseMap={result=error_datasource}]");
  }
}
