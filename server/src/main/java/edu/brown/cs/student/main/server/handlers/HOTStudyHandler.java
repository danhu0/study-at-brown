package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.Constants;
import edu.brown.cs.student.main.server.Utils;
import edu.brown.cs.student.main.server.VectorizedData;
import org.apache.commons.csv.CSVRecord;
import spark.Request;
import spark.Response;
import spark.Route;

import java.util.*;

public class HOTStudyHandler implements Route {
    private VectorizedData data;

    public HOTStudyHandler(VectorizedData data) {
        this.data = data;
    }

    private Set<CSVRecord> getHotSpots(int numToGenerate) {
        Set<CSVRecord> hotSet = new HashSet<>();
        List<CSVRecord> hotSpots = new ArrayList<>(this.data.vectorToData().values());
        Collections.shuffle(hotSpots);
        while(hotSet.size() < numToGenerate) {
            hotSet.add(hotSpots.get(0));
            Collections.shuffle(hotSpots);
        }

        return hotSet;
    }

    @Override
    public Object handle(Request request, Response response) throws Exception {
        Map<String, Object> responseMap = new HashMap<>();
        try {
            Set<CSVRecord> hotSpots = this.getHotSpots(Constants.NUM_SPOTS_TO_RETURN);
            List<Map<String, String>> returnList = new ArrayList<>();
            for (CSVRecord spot : hotSpots) {
                Map<String, String> spotMap = spot.toMap();
                returnList.add(spotMap);
            }
            responseMap.put("response_type", "success");
            responseMap.put("best_spots", hotSpots);
        }
        catch(Exception e) {
            responseMap.put("response_type", "failure");
            responseMap.put("error", e.getMessage());
        }
        return Utils.toMoshiJson(responseMap);
    }
}
