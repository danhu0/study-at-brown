// import { getLoginCookie } from "../utils/cookie";
import ReactDOM from "react-dom";
import getRelavantLounges, { PlaceboxProps, getDistance } from "./Placebox";
import { MockedData } from "./MockedData";
import { useEffect, useState } from "react";
import getLoungeBox from "./Placebox";

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:3232/get-hot");
        const json = await response.json();
        const mappedData = json.best_spots.map((spot: any) => ({
          id: spot.id,
          title: spot.name,
          description: "", // Add description if available
          natural_light_level: parseInt(spot.natural_light_level),
          noise_level: parseInt(spot.noise_level),
          outlet_availability: parseInt(spot.outlet_availability),
          room_size: parseInt(spot.room_size),
          private: parseInt(spot.private),
          food: parseInt(spot.food),
          view: spot.view,
          comfort: 0, // Add comfort if available
          lat: parseFloat(spot.latitude),
          long: parseFloat(spot.longitude),
          building: spot.building,
          study_room: "", // Add study_room if available
          google_link: "", // Add google_link if available
        }));
        setData(await mappedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  async function getUserLocation() {
    const location = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      }
    );
    return location.coords;
  }

  async function handleSearchSubmit() {
    let location = await getUserLocation();
    // getDistance(location);
    //const myPlaceId = document.getElementById("myplace");
  }

  return (
    <div>
      <button
        className="button"
        onClick={async () => {
          handleSearchSubmit();
          //   // - query the backend to clear the user's words
          //   // - clear the user's pins in the database
          //   // await loungeLocator(); // with given parameters,
          //   //maybe we use data of buttons which have been clicked?
        }}
      >
        Input search to backend...
      </button>
      <p></p>
      <div className="search-choices">
        {/* Receive user input for search function */}
        <button
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
          North campus
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
        </button>

        <div>
          <select
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
          </select>
        </div>
        <p></p>
      </div>
      <div className="lounges-container">
        {data.map((data, index) => (
          <div className="lounge" key={index}>
            {getLoungeBox(data)}
          </div>
        ))}
        {/* <div className="places"> */}
      </div>
      <div id="myplace"></div>
    </div>
  );
}
