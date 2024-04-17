import { FeatureCollection } from "geojson";
import { FillLayer } from "react-map-gl";

// Import the raw JSON file
import rl_data1 from "../geodata/mappinginequality.json";

let rl_data: GeoJSON.FeatureCollection | undefined;

const get_geodata: Promise<string | string[][]> = new Promise(async (resolve) => {
  const response = await fetch("http://localhost:3232/get-geodata");
  const json = await response.json();
  const responseType = json["response_type"]
  // console.log(json.type)
  if(responseType == "failure") {
    // console.log("sdfghjkjhgfdsfghjkjhgfdsdfghjkjhgfdsfghj")
    rl_data =  undefined
    resolve("error")
  }
  const result = json["result"];
  rl_data = result
  resolve(result);
});

const propertyName = "holc_grade";
export const geoLayer: FillLayer = {
  id: "geo_data",
  type: "fill",
  paint: {
    "fill-color": [
      "match",
      ["get", propertyName],
      "A",
      "#5bcc04",
      "B",
      "#04b8cc",
      "C",
      "#e9ed0e",
      "D",
      "#d11d1d",
      "#ccc",
    ],
    "fill-opacity": 0.2,
  },
};

// TODO: MAPS PART 4:
// - Download and import the geojson file
// - Implement the two functions below.

// Import the raw JSON file
// import rl_data from "../geodata/fullDownload.json";
// you may need to rename the downloaded .geojson to .json

function isFeatureCollection(json: any): json is FeatureCollection {
  return json.type === "FeatureCollection";
}

// export function overlayData(): GeoJSON.FeatureCollection | undefined {
//   return (isFeatureCollection(rl_data)) ? rl_data : undefined;
// }

export function overlayData(): GeoJSON.FeatureCollection | undefined {
  if (rl_data && typeof rl_data === 'string') {
    try {
      const parsedData = JSON.parse(rl_data) as GeoJSON.FeatureCollection;
      if (isFeatureCollection(parsedData)) {
        rl_data = parsedData;
        return parsedData;
      } else {
        console.error('Parsed data is not a FeatureCollection');
      }
    } catch (error) {
      console.error('Error parsing overlay data:', error);
    }
  } else if (isFeatureCollection(rl_data)) {
    return rl_data;
  }
  return undefined;
}