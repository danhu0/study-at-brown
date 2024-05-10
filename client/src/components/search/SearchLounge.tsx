import { useEffect, useState } from "react";
import { deserializeResponse, getRecs } from "../../utils/api";
import { SearchParameters } from "./SearchParameters";
import getLoungeBox, { PlaceboxProps } from "../placebox/Placebox";

/**
 * Get the user's location using navigator. Note: this is optional for functionality
 *
 * @returns the user's location
 */
async function getUserLocation() {
  try {
    const location = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      }
    );
    return location.coords;
  } catch (error) {
    return null;
  }
}

export const userLocation = getUserLocation();

/**
 * Top level data-management function, which initially displays 3 random
 * recommendations, but when a search is sent, appropriately displays new
 * placeboxes fitting the recommendation parameters by sending a backend
 * query.
 *
 * @returns the components necessary for searching and the results of that search
 */
export default function SearchHomePage() {
  const [data, setData] = useState<PlaceboxProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useState<SearchParameters>({
    natural_light_level: "",
    noise_level: "",
    outlet_availability: "",
    room_size: "",
    private: "",
    food: "",
    view: "",
    home: "",
  });

  // Sets the initial placeboxes to display by querying the get-hot endpoint (random)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:3232/get-hot");
      const json = await response.json();

      setData(await deserializeResponse(json, "best_spots"));
      setLoading(false);
    };
    fetchData();
  }, []);

  /**
   * Simple function to update search parameters
   *
   * @param parameter - the parameter we want to update
   * @param updatedValue - the new value
   */
  function updateSearchParameters(
    parameter: keyof SearchParameters,
    updatedValue: string
  ) {
    setSearchParams((searchParams) => ({
      ...searchParams,
      [parameter]: updatedValue,
    }));
  }

  /**
   * Sends the search query and updates the data to display
   */
  async function handleSearchSubmit() {
    setLoading(true);
    const newData = await getRecs(searchParams);
    setData(newData);
    setLoading(false);
  }

  return (
    <div>
      <button
        className="button"
        aria-label="search-button"
        onClick={async () => {
          handleSearchSubmit();
        }}
      >
        Send Search To Backend
      </button>
      <p></p>
      <div className="search-choices-container">
        <div className="search-choices">
          <label className="search-label">Natural Light</label>

          <select
            aria-label="natlightdropdown"
            className="search-choices-selector"
            onChange={(e) => {
              updateSearchParameters("natural_light_level", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
        <div className="search-choices">
          <label className="search-label">Noise Level</label>
          <select
            aria-label="noisedropdown"
            className="search-choices-selector"
            onChange={(e) => {
              updateSearchParameters("noise_level", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="search-choices">
          <label className="search-label">Outlet Availability</label>
          <select
            aria-label="outletdropdown"
            className="search-choices-selector"
            onChange={(e) => {
              updateSearchParameters("outlet_availability", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="search-choices">
          <label className="search-label">Room Size</label>
          <select
            aria-label="roomsizedropdown"
            className="search-choices-selector"
            onChange={(e) => {
              updateSearchParameters("room_size", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="search-choices">
          <label className="search-label">Private</label>
          <select
            aria-label="privatedropdown"
            className="search-choices-selector"
            onChange={(e) => {
              updateSearchParameters("private", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="search-choices">
          <label className="search-label">Food</label>
          <select
            aria-label="fooddropdown"
            className="search-choices-selector"
            onChange={(e) => {
              updateSearchParameters("food", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="search-choices">
          <label className="search-label">View</label>
          <select
            aria-label="viewdropdown"
            className="search-choices-selector"
            onChange={(e) => {
              updateSearchParameters("view", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
        </div>
        <div className="search-choices">
          <label className="search-label">Comfort</label>
          <select
            aria-label="comfortdropdown"
            className="search-choices-selector"
            onChange={(e) => {
              updateSearchParameters("home", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
      </div>
      {loading ? (
        <div className="loading-container">
          <div className="loading-text">
            <p>Loading...</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="lounges-container" aria-label="lounges-container">
            {data.map((data, index) => (
              <div className="lounge" key={index}>
                {getLoungeBox(data)}
              </div>
            ))}
          </div>
          <div id="myplace"></div>
        </div>
      )}
    </div>
  );
}
