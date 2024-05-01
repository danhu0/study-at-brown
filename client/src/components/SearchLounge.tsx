// import { getLoginCookie } from "../utils/cookie";
import ReactDOM from "react-dom";
import getRelavantLounges, { getDistance } from "./Placebox";
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
    setMocked(true);
    let location = await getUserLocation();
    getDistance(location);
    //const myPlaceId = document.getElementById("myplace");
  }

  return (
    <div>
      <button
        className="button"
        onClick={async () => {
          handleSearchSubmit();
        }}
      >
        Input search to backend...
      </button>
      <p></p>
      <div className="search-choices">
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
          <text>Quiet Level</text>
            <select>
          <option value="">--</option>
          <option value="">0</option>
          <option value="">1</option>
          <option value="">2</option>
          </select>
          <text>Natural Light</text>
            
          <select>
          <option value="">--</option>
          <option value="">0</option>
          <option value="">1</option>
          <option value="">2</option>
          </select>
          <text>Noise Level</text>
          <select>
          <option value="">--</option>
          <option value="">0</option>
          <option value="">1</option>
          <option value="">2</option>
          </select>
          <text>Outlet Availability</text>
          <select>
          <option value="">--</option>
          <option value="">0</option>
          <option value="">1</option>
          <option value="">2</option>
          </select>
          <text>Room Size</text>
          <select>
          <option value="">--</option>
          <option value="">0</option>
          <option value="">1</option>
          <option value="">2</option>
          </select>
          <text>Private</text>
          <select>
          <option value="">--</option>
          <option value="">0</option>
          <option value="">1</option>
          <option value="">2</option>
          </select>
          <text>Food</text>
          <select>
          <option value="">--</option>
          <option value="">0</option>
          <option value="">1</option>
          <option value="">2</option>
          </select>
          <text>View</text>
          <select>
          <option value="">--</option>
          <option value="">0</option>
          <option value="">1</option>
          <option value="">2</option>
          </select>
          <text>Comfort</text>
          <select>
          <option value="">--</option>
          <option value="">0</option>
          <option value="">1</option>
          <option value="">2</option>
          </select>
          <input type="time"></input>
        </div>
        <p></p>
      </div>
      <div className="lounges-container">
        {mocked &&
          MockedData.map((data, index) => (
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
