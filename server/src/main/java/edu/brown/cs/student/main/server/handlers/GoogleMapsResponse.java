package edu.brown.cs.student.main.server.handlers;

import java.util.ArrayList;
import java.util.List;

public class GoogleMapsResponse {
  public List<String> destination_addresses = new ArrayList<>();
  public List<String> origin_addresses = new ArrayList<>();
  public List<Row> rows;
  public String status;

  public static class Row {
    public List<Element> elements;
  }

  public static class Element {
    public Distance distance;
    public Duration duration;
    public String status;
  }

  public static class Duration {
    public String text;
    public String value;
  }

  public static class Distance {
    public String text;
    public String value;
  }
}
