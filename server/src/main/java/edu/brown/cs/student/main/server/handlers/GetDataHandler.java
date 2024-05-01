package edu.brown.cs.student.main.server.handlers;

import edu.brown.cs.student.main.server.Utils;
import edu.brown.cs.student.main.server.VectorizedData;
import org.apache.commons.csv.CSVRecord;
import spark.Request;
import spark.Response;
import spark.Route;

import java.util.HashMap;
import java.util.Map;

public class GetDataHandler implements Route {
    private VectorizedData data;
    public GetDataHandler(VectorizedData data) {
        this.data = data;
    }
    @Override
    public Object handle(Request request, Response response) throws Exception {
        Map<String, Object> responseMap = new HashMap<>();

        try {
            String requestedName = request.queryParams("name");
            double[] vector = this.data.nameToVector().get(requestedName);
            Map<String, String> returnData = this.data.vectorToData().get(vector).toMap();
            responseMap.put("response_type", "success");
            responseMap.put("best_spots", returnData);
        }
        catch(Exception e) {
            responseMap.put("response_type", "failure");
            responseMap.put("error", e.getMessage());
        }
        return Utils.toMoshiJson(responseMap);
    }
}