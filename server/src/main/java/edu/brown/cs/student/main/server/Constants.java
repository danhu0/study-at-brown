package edu.brown.cs.student.main.server;

import java.util.List;

public class Constants {
  public static final String STUDY_SPOT_DATA_PATH =
      "src/main/java/edu/brown/cs/student/main/server/data/study_spots.csv";
  public static final List<String> INCLUDED_ATTRIBUTES =
      List.of(
          "natural_light_level",
          "noise_level",
          "outlet_availability",
          "room_size",
          "private",
          "food",
          "view",
          "home",
          "latitude",
          "longitude");
  public static final int NUM_SPOTS_TO_RETURN = 3;
}
