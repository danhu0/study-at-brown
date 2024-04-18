import { useState } from "react";
import ClearPins from "./SearchLounge";
import Mapbox from "./Mapbox";
import SearchLounge from "./SearchLounge";

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
      <h1 aria-label="Page Title">Lounge Locator</h1>
      <button onClick={() => setSection(Section.MAP)}>Map (Optional implement this)</button>
      {section === Section.SEARCH_AND_CLEAR ? <SearchLounge /> : null}
      {section === Section.MAP ? <Mapbox /> : null}
    </div>
  );
}
