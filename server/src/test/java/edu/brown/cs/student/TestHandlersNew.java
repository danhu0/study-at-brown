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

import java.util.concurrent.TimeUnit;
import java.util.logging.*;

import static edu.brown.cs.student.main.server.Server.setUpServer;
import static org.testng.AssertJUnit.assertEquals;
import static org.testng.AssertJUnit.assertTrue;

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

    /**
     * Tests clear-user, add-lounge, get-user using mocked utils
     * @throws IOException
     * @throws InterruptedException
     */
    @Test
    public void testBasicGetUser() throws IOException, InterruptedException {
        assertEquals(new BufferedReader(new InputStreamReader(tryRequest("clear-user?uid=mock-user").getInputStream())).readLine(), "{\"response_type\":\"success\"}");
        assertEquals(new BufferedReader(new InputStreamReader(tryRequest("add-lounge?uid=mock-user&spot-id=2").getInputStream())).readLine(), "{\"spot\":{\"id\":2},\"response_type\":\"success\"}");
        assertEquals(new BufferedReader(new InputStreamReader(tryRequest("add-lounge?uid=mock-user&spot-id=4").getInputStream())).readLine(), "{\"spot\":{\"id\":4},\"response_type\":\"success\"}");
        assertEquals(new BufferedReader(new InputStreamReader(tryRequest("add-lounge?uid=mock-user&spot-id=5").getInputStream())).readLine(), "{\"spot\":{\"id\":5},\"response_type\":\"success\"}");

//        tryRequest("clear-user?uid=mock-user");
//        tryRequest("add-lounge?uid=mock-user&spot-id=2");
//        tryRequest("add-lounge?uid=mock-user&spot-id=4");
//        tryRequest("add-lounge?uid=mock-user&spot-id=5");
        HttpURLConnection clientConnection = tryRequest("get-user?uid=mock-user");
        // loading csv
        assertEquals(200, clientConnection.getResponseCode());
        InputStream inputStream = clientConnection.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream));
        String output = reader.readLine();
        reader.close();
        inputStream.close();
        assertTrue(output.contains("{\"id\":\"2\"") && output.contains("{\"id\":\"4\"") && output.contains("{\"id\":\"5\""));

        assertEquals(new BufferedReader(new InputStreamReader(tryRequest("clear-user?uid=mock-user").getInputStream())).readLine(), "{\"response_type\":\"success\"}");

        //test that clear user clears
        clientConnection = tryRequest("get-user?uid=mock-user");
        assertEquals(200, clientConnection.getResponseCode());
        inputStream = clientConnection.getInputStream();
        reader = new BufferedReader(new InputStreamReader(inputStream));
        output = reader.readLine();
        reader.close();
        inputStream.close();
        assertTrue(!(output.contains("{\"id\":\"2\"") && output.contains("{\"id\":\"4\"") && output.contains("{\"id\":\"5\"")));
    }
}