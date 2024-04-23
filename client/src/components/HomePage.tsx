import { useState } from "react";
import ClearPins from "./SearchLounge";
import Mapbox from "./Mapbox";
import SearchLounge from "./SearchLounge";
import UserSavedPlaces from "./UserSavedPlaces";


enum Section {
  SEARCH_AND_CLEAR = "SEARCH_AND_CLEAR",
  MAP = "MAP",
  SAVED_PLACES = "SAVED_PLACES"
}
/**
 *  Maps component displays a div with buttons and a map.
 * @returns a div with buttons and a map
 */
export default function HomePage() {
  const [section, setSection] = useState<Section>(Section.SEARCH_AND_CLEAR);

  return (
    <div>
      <h1 onClick={() => setSection(Section.SEARCH_AND_CLEAR)}
      aria-label="Page Title">Lounge Locator</h1>
      {/* <button onClick={() => setSection(Section.MAP)}>Map (Optional implement this)</button> */}
      <button onClick={() => setSection(Section.SAVED_PLACES)}>User's Favorites</button>
      <button onClick={() => setSection(Section.SEARCH_AND_CLEAR)}>Home</button>

      {section === Section.SEARCH_AND_CLEAR ? <SearchLounge /> : null}
      {/* {section === Section.MAP ? <Mapbox /> : null} */}
      {section === Section.SAVED_PLACES ? <UserSavedPlaces /> : null}
    </div>
  );
}
