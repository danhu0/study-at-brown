import { useState } from "react";
import ClearPins from "./SearchLounge";
// import Mapbox from "./Mapbox";
import SearchLounge from "./SearchLounge";
import UserSavedPlaces from "./UserSavedPlaces";

enum Section {
  SEARCH_AND_CLEAR = "SEARCH_AND_CLEAR",
  SAVED_PLACES = "SAVED_PLACES",
}
/**
 *  Homepage component displays a div with buttons and a search query.
 */
export default function HomePage() {
  const [section, setSection] = useState<Section>(Section.SEARCH_AND_CLEAR);

  return (
    <div className="header">
      <img src="/Brown-University-Logo.png" className="brown-logo"></img>
      <h1
        onClick={() => setSection(Section.SEARCH_AND_CLEAR)}
        aria-label="Page Title"
      >
        Study @ Brown
      </h1>
      {/* <button onClick={() => setSection(Section.MAP)}>Map (Optional implement this)</button> */}
      <button
        className="button"
        aria-label="Home-button"
        onClick={() => setSection(Section.SEARCH_AND_CLEAR)}
      >
        Home
      </button>
      <button
        className="button"
        aria-label="User-favorites-button"
        onClick={() => setSection(Section.SAVED_PLACES)}
      >
        User's Favorites
      </button>

      {section === Section.SEARCH_AND_CLEAR ? <SearchLounge /> : null}
      {/* {section === Section.MAP ? <Mapbox /> : null} */}
      {section === Section.SAVED_PLACES ? <UserSavedPlaces /> : null}
    </div>
  );
}
