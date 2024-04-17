import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useState } from "react";
import Map, {
  Layer,
  MapLayerMouseEvent,
  Source,
  ViewStateChangeEvent,
  Marker,
} from "react-map-gl";
import { geoLayer, overlayData } from "../utils/overlay";
import { addCoords, getCoords } from "../utils/api";
import { get } from "http";

/**
 * Mapbox component displays a map with pins at the locations where the user has clicked.
 */
const MAPBOX_API_KEY = process.env.MAPBOX_TOKEN;
if (!MAPBOX_API_KEY) {
  console.error("Mapbox API key not found. Please add it to your .env file.");
}

/**
 * Interface for the latitude and longitude of a point on the map.
 */
export interface LatLong {
  lat: number;
  long: number;
}

/**
 * Function that returns a div with a map that displays pins at the locations where the user has clicked.
 * @returns a div with a map that displays pins at the locations where the user has clicked.
 */
export default function Mapbox() {
  const [viewState, setViewState] = useState({
    longitude: -73.7824,
    latitude: 40.9115,
    zoom: 10,
  });

  const [overlay, setOverlay] = useState<GeoJSON.FeatureCollection | undefined>(
    undefined
  );

  const [clickedCoords, setClickedCoords] = useState<LatLong[]>([]); // Moved useState here

  function onMapClick(e: MapLayerMouseEvent) {
    if (e) {
      const handleAddCoords = async () => {
        await addCoords(e.lngLat.lat.toString(), e.lngLat.lng.toString());
      };

      setClickedCoords((prevCoords) => [
        ...prevCoords,
        { lat: e.lngLat.lat, long: e.lngLat.lng },
      ]);

      handleAddCoords();
    }
  }

  useEffect(() => {
    setOverlay(overlayData());

    getCoords().then((data) => {
      setClickedCoords(data.pins);
    });
  }, []);

  // useEffect(() => {
  //   getWords().then((data) => {
  //     setWords(data.words);
  //   });
  // }, []);

  return (
    <div className="map">
      <Map
        mapboxAccessToken={MAPBOX_API_KEY}
        {...viewState}
        style={{ width: window.innerWidth, height: window.innerHeight }}
        mapStyle={"mapbox://styles/mapbox/streets-v12"}
        onMove={(ev: ViewStateChangeEvent) => setViewState(ev.viewState)}
        onClick={(ev: MapLayerMouseEvent) => onMapClick(ev)}
      >
        {clickedCoords.map((coord, index) => (
          <Marker
            key={index}
            longitude={coord.long}
            latitude={coord.lat}
            // offsetLeft={-20}
            // offsetTop={-10}
            anchor="bottom"
          >
            {/* <div>Marker {index + 1}</div> */}
          </Marker>
        ))}
        <Source id="geo_data" type="geojson" data={overlay}>
          <Layer id={geoLayer.id} type={geoLayer.type} paint={geoLayer.paint} />
          {/* which is the same as: <Layer {...geoLayer} /> */}
        </Source>
      </Map>
    </div>
  );
}
