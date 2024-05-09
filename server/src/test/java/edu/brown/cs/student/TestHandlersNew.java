package edu.brown.cs.student;


import com.squareup.moshi.Moshi;
import edu.brown.cs.student.main.server.Server;
import edu.brown.cs.student.main.server.handlers.*;
import edu.brown.cs.student.main.server.storage.FirebaseUtilities;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import edu.brown.cs.student.main.server.utils.VectorizedData;
import org.eclipse.jetty.util.IO;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import spark.Spark;

import java.util.logging.*;

import static edu.brown.cs.student.main.server.Server.setUpServer;
import static org.testng.AssertJUnit.assertEquals;

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

    @BeforeAll
    public static void setup_before_everything() {
    Spark.port(0);
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

    @Test
    public void testBasicGetUser() throws IOException {
        tryRequest("clear-user?uid=mock-user");
        tryRequest("add-lounge?uid=mock-user&spot-id=2");
        tryRequest("add-lounge?uid=mock-user&spot-id=4");
        tryRequest("add-lounge?uid=mock-user&spot-id=5");
        HttpURLConnection clientConnection = tryRequest("get-user?uid=mock-user");
        // loading csv
        assertEquals(200, clientConnection.getResponseCode());
        InputStream inputStream = clientConnection.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String output = reader.readLine();
        reader.close();
        inputStream.close();
        assertEquals(output, "{\"response_type\":\"success\",\"saved-spots\":[{\"id\":\"2\",\"title\":\"Main Green\",\"building\":\"Outside\",\"Description\":\"\",\"natural_light_level\":\"4\",\"noise_level\":\"2\",\"outlet_availability\":\"0\",\"room_size\":\"2\",\"private\":\"0\",\"food\":\"0\",\"view\":\"0\",\"home\":\"1\",\"latitude\":\"41.82623\",\"longitude\":\"-71.40338\",\"hours_open\":\"n/a\",\"hours_close\":\"n/a\",\"days_open\":\"1111111\",\"hours\":\"\",\"study_room\":\"0\",\"google_link \":\"https://www.google.com/maps/place/John+D.+Rockefeller,+Jr.+Library/@41.8257007,-71.4051436,15z/data=!4m6!3m5!1s0x89e44446ec7c0d51:0x2fde92d441a35057!8m2!3d41.8257007!4d-71.4051436!16s%2Fm%2F047mq5j?entry=ttu\",\"campus_position\":\"south\"},{\"id\":\"4\",\"title\":\"Alphabet Room\",\"building\":\"Pembroke Hall\",\"Description\":\"\",\"natural_light_level\":\"3\",\"noise_level\":\"0\",\"outlet_availability\":\"1\",\"room_size\":\"2\",\"private\":\"1\",\"food\":\"0\",\"view\":\"1\",\"home\":\"2\",\"latitude\":\"41.82918\",\"longitude\":\"-71.40266\",\"hours_open\":\"\",\"hours_close\":\"17:00\",\"days_open\":\"\",\"hours\":\"\",\"study_room\":\"0\",\"google_link \":\"https://www.google.com/maps/place/John+D.+Rockefeller,+Jr.+Library/@41.8257007,-71.4051436,15z/data=!4m6!3m5!1s0x89e44446ec7c0d51:0x2fde92d441a35057!8m2!3d41.8257007!4d-71.4051436!16s%2Fm%2F047mq5j?entry=ttu\",\"campus_position\":\"north\"},{\"id\":\"5\",\"title\":\"Kassar FOX\",\"building\":\"Kassar\",\"Description\":\"\",\"natural_light_level\":\"0\",\"noise_level\":\"1\",\"outlet_availability\":\"1\",\"room_size\":\"2\",\"private\":\"1\",\"food\":\"0\",\"view\":\"0\",\"home\":\"0\",\"latitude\":\"41.82527\",\"longitude\":\"-71.40003\",\"hours_open\":\"\",\"hours_close\":\"17:00\",\"days_open\":\"0111110\",\"hours\":\"\",\"study_room\":\"0\",\"google_link \":\"https://www.google.com/maps/place/John+D.+Rockefeller,+Jr.+Library/@41.8257007,-71.4051436,15z/data=!4m6!3m5!1s0x89e44446ec7c0d51:0x2fde92d441a35057!8m2!3d41.8257007!4d-71.4051436!16s%2Fm%2F047mq5j?entry=ttu\",\"campus_position\":\"south\"}]}");

    }
}