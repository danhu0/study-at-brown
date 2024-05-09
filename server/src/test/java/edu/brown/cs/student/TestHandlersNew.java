package edu.brown.cs.student;

import static edu.brown.cs.student.main.server.Server.setUpServer;
import static org.testng.AssertJUnit.assertEquals;
import static org.testng.AssertJUnit.assertTrue;

import edu.brown.cs.student.main.server.handlers.*;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.logging.*;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.hadoop.shaded.org.apache.commons.lang3.StringUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;

public class TestHandlersNew {

  @BeforeAll
  public static void setup_before_everything() {
    // Spark.port(0);
    Logger.getLogger("").setLevel(Level.WARNING); // empty name = root logger
  }

  @BeforeEach
  public void setup() {
    setUpServer(true);
  }

  @AfterEach
  public void teardown() {
    // Gracefully stop Spark listening on both endpoints after each test
    Spark.unmap("add-lounge");
    Spark.unmap("list-lounges");
    Spark.unmap("clear-user");

    Spark.unmap("get-user");
    Spark.unmap("get-recs");
    Spark.unmap("get-hot");
    Spark.unmap("get-data");
    Spark.unmap("get-distance");
    Spark.unmap("get-reviews");
    Spark.unmap("add-review");

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
   * Tests clear-user, add-lounge, get-user using mocked utils
   *
   * @throws IOException
   * @throws InterruptedException
   */
  @Test
  public void testBasicGetUser() throws IOException, InterruptedException {
    assertEquals(
        new BufferedReader(
                new InputStreamReader(tryRequest("clear-user?uid=mock-user").getInputStream()))
            .readLine(),
        "{\"response_type\":\"success\"}");
    assertEquals(
        new BufferedReader(
                new InputStreamReader(
                    tryRequest("add-lounge?uid=mock-user&spot-id=2").getInputStream()))
            .readLine(),
        "{\"spot\":{\"id\":2},\"response_type\":\"success\"}");
    assertEquals(
        new BufferedReader(
                new InputStreamReader(
                    tryRequest("add-lounge?uid=mock-user&spot-id=4").getInputStream()))
            .readLine(),
        "{\"spot\":{\"id\":4},\"response_type\":\"success\"}");
    assertEquals(
        new BufferedReader(
                new InputStreamReader(
                    tryRequest("add-lounge?uid=mock-user&spot-id=5").getInputStream()))
            .readLine(),
        "{\"spot\":{\"id\":5},\"response_type\":\"success\"}");

    // tryRequest("clear-user?uid=mock-user");
    // tryRequest("add-lounge?uid=mock-user&spot-id=2");
    // tryRequest("add-lounge?uid=mock-user&spot-id=4");
    // tryRequest("add-lounge?uid=mock-user&spot-id=5");
    HttpURLConnection clientConnection = tryRequest("get-user?uid=mock-user");
    // loading csv
    assertEquals(200, clientConnection.getResponseCode());
    InputStream inputStream = clientConnection.getInputStream();
    BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
    String output = reader.readLine();
    reader.close();
    inputStream.close();
    assertTrue(
        output.contains("{\"id\":\"2\"")
            && output.contains("{\"id\":\"4\"")
            && output.contains("{\"id\":\"5\""));

    assertEquals(
        new BufferedReader(
                new InputStreamReader(tryRequest("clear-user?uid=mock-user").getInputStream()))
            .readLine(),
        "{\"response_type\":\"success\"}");

    // test that clear user clears
    clientConnection = tryRequest("get-user?uid=mock-user");
    assertEquals(200, clientConnection.getResponseCode());
    inputStream = clientConnection.getInputStream();
    reader = new BufferedReader(new InputStreamReader(inputStream));
    output = reader.readLine();
    reader.close();
    inputStream.close();
    assertTrue(
        !(output.contains("{\"id\":\"2\"")
            && output.contains("{\"id\":\"4\"")
            && output.contains("{\"id\":\"5\"")));
  }

  @Test
  public void testGetRecs() throws IOException {
    assertEquals(
        new BufferedReader(
                new InputStreamReader(
                    tryRequest("get-recs?uid=mock-user&num-recs=3").getInputStream()))
            .readLine(),
        "{\"response_type\":\"success\",\"best_spots\":[{\"id\":\"2\",\"title\":\"Main Green\",\"building\":\"Outside\",\"Description\":\"\",\"natural_light_level\":\"4\",\"noise_level\":\"2\",\"outlet_availability\":\"0\",\"room_size\":\"2\",\"private\":\"0\",\"food\":\"0\",\"view\":\"0\",\"home\":\"1\",\"latitude\":\"41.82623\",\"longitude\":\"-71.40338\",\"hours_open\":\"n/a\",\"hours_close\":\"n/a\",\"days_open\":\"1111111\",\"hours\":\"\",\"study_room\":\"0\",\"google_link \":\"https://www.google.com/maps/place/John+D.+Rockefeller,+Jr.+Library/@41.8257007,-71.4051436,15z/data=!4m6!3m5!1s0x89e44446ec7c0d51:0x2fde92d441a35057!8m2!3d41.8257007!4d-71.4051436!16s%2Fm%2F047mq5j?entry=ttu\",\"campus_position\":\"south\"},{\"id\":\"5\",\"title\":\"Kassar FOX\",\"building\":\"Kassar\",\"Description\":\"\",\"natural_light_level\":\"0\",\"noise_level\":\"1\",\"outlet_availability\":\"1\",\"room_size\":\"2\",\"private\":\"1\",\"food\":\"0\",\"view\":\"0\",\"home\":\"0\",\"latitude\":\"41.82527\",\"longitude\":\"-71.40003\",\"hours_open\":\"\",\"hours_close\":\"17:00\",\"days_open\":\"0111110\",\"hours\":\"\",\"study_room\":\"0\",\"google_link \":\"https://www.google.com/maps/place/John+D.+Rockefeller,+Jr.+Library/@41.8257007,-71.4051436,15z/data=!4m6!3m5!1s0x89e44446ec7c0d51:0x2fde92d441a35057!8m2!3d41.8257007!4d-71.4051436!16s%2Fm%2F047mq5j?entry=ttu\",\"campus_position\":\"south\"},{\"id\":\"3\",\"title\":\"134C\",\"building\":\"The Rock\",\"Description\":\"\",\"natural_light_level\":\"1\",\"noise_level\":\"0\",\"outlet_availability\":\"2\",\"room_size\":\"0\",\"private\":\"2\",\"food\":\"1\",\"view\":\"0\",\"home\":\"0\",\"latitude\":\"41.82568\",\"longitude\":\"-71.40502\",\"hours_open\":\"8:00\",\"hours_close\":\"2:00 AM\",\"days_open\":\"1111111\",\"hours\":\"\",\"study_room\":\"1\",\"google_link \":\"https://www.google.com/maps/place/John+D.+Rockefeller,+Jr.+Library/@41.8257007,-71.4051436,15z/data=!4m6!3m5!1s0x89e44446ec7c0d51:0x2fde92d441a35057!8m2!3d41.8257007!4d-71.4051436!16s%2Fm%2F047mq5j?entry=ttu\",\"campus_position\":\"south\"}]}");

    assertTrue(
        new BufferedReader(
                new InputStreamReader(
                    tryRequest("get-recs?uid=mock-user&num-recs=1&natural_light_level=4")
                        .getInputStream()))
            .readLine()
            .contains("Main Green"));
  }

  @Test
  public void testGetHot() throws IOException {
    int count =
        StringUtils.countMatches(
            (new BufferedReader(new InputStreamReader(tryRequest("get-hot").getInputStream()))
                .readLine()),
            "id");
    assertEquals(5, count);
    count =
        StringUtils.countMatches(
            (new BufferedReader(new InputStreamReader(tryRequest("get-hot").getInputStream()))
                .readLine()),
            "id");
    assertEquals(4, count);
    count =
        StringUtils.countMatches(
            (new BufferedReader(new InputStreamReader(tryRequest("get-hot").getInputStream()))
                .readLine()),
            "id");
    assertEquals(5, count);
    count =
        StringUtils.countMatches(
            (new BufferedReader(new InputStreamReader(tryRequest("get-hot").getInputStream()))
                .readLine()),
            "id");
    assertEquals(5, count);
  }
}
