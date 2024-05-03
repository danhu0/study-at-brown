// import { getLoginCookie } from "../utils/cookie";
import ReactDOM from "react-dom";
import getRelavantLounges, { PlaceboxProps, getDistance } from "./Placebox";
import { MockedData } from "./MockedData";
import { useEffect, useState } from "react";
import getLoungeBox from "./Placebox";
import { getRecs, deserializeResponse } from "../utils/api";
import { SearchParameters } from "./SearchParameters";
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
      const response = await fetch("http://localhost:3232/get-hot");
      const json = await response.json();
      setData(await deserializeResponse(json));
    };
    fetchData();
  }, []);

  const [searchedData, setSearchedData] = useState<PlaceboxProps[]>(MockedData);
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

    getDistance(location);

    const quietparam: string = document
      .getElementsByClassName("quietparam")
      .toString();
    const natlightparam: string = document
      .getElementsByClassName("natlightparam")
      .toString();
    const viewparam: string = document
      .getElementsByClassName("viewparam")
      .toString();
    const outletparam: string = document
      .getElementsByClassName("outletparam")
      .toString();
    const roomsizeparam: string = document
      .getElementsByClassName("roomsizeparam")
      .toString();
    const privateparam: string = document
      .getElementsByClassName("privateparam")
      .toString();
    const comfortparam: string = document
      .getElementsByClassName("comfortparam")
      .toString();
    const foodparam: string = document
      .getElementsByClassName("foodparam")
      .toString();
    const searchParams: SearchParameters = {
      natural_light_level: natlightparam,
      noise_level: quietparam,
      outlet_availability: outletparam,
      room_size: roomsizeparam,
      private: privateparam,
      food: foodparam,
      view: viewparam,
      home: comfortparam,
    };
    const newData = await getRecs(searchParams);
    setData(await getRecs(searchParams)); ///////////Change
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
          <select className="quietparam">
            <option value="">--</option>
            <option value="">0</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>
          <text>Natural Light</text>

          <select className="natlightparam">
            <option value="">--</option>
            <option value="">0</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>
          <text>Noise Level</text>
          <select className="noiseparam">
            <option value="">--</option>
            <option value="">0</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>
          <text>Outlet Availability</text>
          <select className="outletparam">
            <option value="">--</option>
            <option value="">0</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>
          <text>Room Size</text>
          <select className="roomsizeparam">
            <option value="">--</option>
            <option value="">0</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>
          <text>Private</text>
          <select className="privateparam">
            <option value="">--</option>
            <option value="">0</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>
          <text>Food</text>
          <select className="foodparam">
            <option value="">--</option>
            <option value="">0</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>
          <text>View</text>
          <select className="viewparam">
            <option value="">--</option>
            <option value="">0</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>
          <text>Comfort</text>
          <select className="comfortparam">
            <option value="">--</option>
            <option value="">0</option>
            <option value="">1</option>
            <option value="">2</option>
          </select>
          <text>Time</text>
          <input type="time"></input>
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
