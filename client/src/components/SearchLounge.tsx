// import { getLoginCookie } from "../utils/cookie";
import ReactDOM from "react-dom";
import getRelavantLounges from "./Placebox";
import { MockedData } from "./MockedData";
import { useState } from "react";
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

  function handleSearchSubmit() {
    setMocked(true);
    //const myPlaceId = document.getElementById("myplace");
  }

  return (
    <div>
      <button
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
          className="northcampusbutton"
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
          className="southcampusbutton"
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
