// import { getLoginCookie } from "../utils/cookie";
import ReactDOM from "react-dom";
import getRelavantLounges, { PlaceboxProps, getDistance } from "./Placebox";
import { MockedData } from "./MockedData";
import { useEffect, useState } from "react";
import getLoungeBox from "./Placebox";
import { getRecs, deserializeResponse } from "../utils/api";
import { SearchParameters } from "./SearchParameters";

async function getUserLocation() {
  const location = await new Promise<GeolocationPosition>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
  return location.coords;
}

/**
 * ClearPins component calls the clearUser function to clear the user's pins in the
 * database when the button is clicked.
 *
 * @returns div button that on click clears pins
 */
export default function SearchHomePage() {
  // const USER_ID = getLoginCookie() || "";
  const [mocked, setMocked] = useState(false);
  const [data, setData] = useState<PlaceboxProps[]>([]);
  const [userLocation, setUserLocation] = useState<GeolocationCoordinates>();
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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await fetch("http://localhost:3232/get-hot");
      const json = await response.json();
      setData(await deserializeResponse(json));
      setLoading(false);
    };
    fetchData();
  }, []);

  const [searchedData, setSearchedData] = useState<PlaceboxProps[]>(MockedData);

  function updateSearchParameters(
    parameter: keyof SearchParameters,
    updatedValue: string
  ) {
    setSearchParams((searchParams) => ({
      ...searchParams,
      [parameter]: updatedValue,
    }));
  }

  async function handleSearchSubmit() {
    const newData = await getRecs(searchParams);
    setData(newData); ///////////Change
    console.log(userLocation);
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
        Input search to backend...
      </button>
      <p></p>
      <div className="search-choices" aria-label="search-choices">
        {/* Receive user input for search function */}
        {/* <button
          className="campus-selector-button"
          id="northcampusbutton"
          onClick={async () => {
            // await addParam("northcampus");
            document
              .getElementById("northcampusbutton")
              ?.classList.toggle("button-clicked");
          }}
        >
          {" "}
          {/* Maybe we can have like multiple buttons and each 
      one the user picks well include in their desires? */}
        {/* North campus
        </button>
        <button
          className="campus-selector-button"
          id="southcampusbutton"
          onClick={async () => {
            // await addParam("southcampus");
            document
              .getElementById("southcampusbutton")
              ?.classList.toggle("button-clicked");
          }}
        >
          South campus
        </button> */}

        <div>
          {/* <select
            className="myselector"
            id="myselector"
            onChange={
              //need to add function here which would only toggle when necessary
              async () => {
                document
                  .getElementById("myselector")
                  ?.classList.toggle("selector-selected");
                // document.querySelector('.myselector').classList.toggle('selector-selected');
              }
            }
          >
            <option value="">Select an option (ex)</option>
            <option value="option1">Library</option>
            <option value="option2">Cafe</option>
            <option value="option3">Lounge</option>
          </select>button which clears all user dat */}
          <label>Quiet Level</label>
          <select
            className="quietparam"
            aria-label="quietdropdown"
            onChange={(e) => {
              updateSearchParameters("noise_level", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <label>Natural Light</label>

          <select
            className="natlightparam"
            aria-label="natlightdropdown"
            onChange={(e) => {
              updateSearchParameters("natural_light_level", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <label>Noise Level</label>
          <select
            className="noiseparam"
            aria-label="noisedropdown"
            onChange={(e) => {
              updateSearchParameters("noise_level", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <label>Outlet Availability</label>
          <select
            className="outletparam"
            aria-label="outletdropdown"
            onChange={(e) => {
              updateSearchParameters("outlet_availability", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <label>Room Size</label>
          <select
            className="roomsizeparam"
            aria-label="roomsizedropdown"
            onChange={(e) => {
              updateSearchParameters("room_size", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <label>Private</label>
          <select
            className="privateparam"
            aria-label="privatedropdown"
            onChange={(e) => {
              updateSearchParameters("private", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <label>Food</label>
          <select
            className="foodparam"
            aria-label="fooddropdown"
            onChange={(e) => {
              updateSearchParameters("food", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <label>View</label>
          <select
            className="viewparam"
            aria-label="viewdropdown"
            onChange={(e) => {
              updateSearchParameters("view", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <label>Comfort</label>
          <select
            className="comfortparam"
            aria-label="comfortdropdown"
            onChange={(e) => {
              updateSearchParameters("home", e.target.value);
            }}
          >
            <option value="">--</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
          </select>
          <label>Time</label>
          <input type="time"></input>
        </div>
        <p></p>
      </div>
      {loading ? (
        <div className="loading-text" aria-label="loading-text">
          <p>Loading...</p>
        </div>
      ) : (
        <div>
          <div className="lounges-container"
                      aria-label="lounges-container"
                      >
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
