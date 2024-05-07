package edu.brown.cs.student.main.server.datasource;

import edu.brown.cs.student.main.server.constants.CoordBounds;
import java.io.IOException;
import java.net.URISyntaxException;
import java.util.HashMap;

/** Datasource interface which enables mocking. */
public interface Datasource {

  String sendRequest(HashMap<CoordBounds, Double> params)
      throws URISyntaxException, IOException, InterruptedException;

  String sendRequest(String keyword);
}
