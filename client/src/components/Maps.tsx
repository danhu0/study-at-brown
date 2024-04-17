import { useState } from "react";
import ClearPins from "./ClearPins";
import Mapbox from "./Mapbox";

enum Section {
  SEARCH_AND_CLEAR = "SEARCH_AND_CLEAR",
  MAP = "MAP",
}
/**
 *  Maps component displays a div with buttons and a map.
 * @returns a div with buttons and a map
 */
export default function Maps() {
  const [section, setSection] = useState<Section>(Section.SEARCH_AND_CLEAR);

  return (
    <div>
      <h1 aria-label="Page Title">Maps</h1>
      {/* {<ClearPins />} */}
      <button onClick={() => setSection(Section.SEARCH_AND_CLEAR)}>
        Clear Pins
      </button>
      <button onClick={() => setSection(Section.MAP)}>Map</button>
      {/* {<Mapbox />} */}
      {section === Section.SEARCH_AND_CLEAR ? <ClearPins /> : null}
      {section === Section.MAP ? <Mapbox /> : null}
    </div>
  );
}
