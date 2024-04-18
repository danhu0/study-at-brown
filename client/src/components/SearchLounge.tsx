import { useEffect, useState } from "react";
import { addWord, clearUser, getWords } from "../utils/api";
import { getLoginCookie } from "../utils/cookie";

/**
 * ClearPins component calls the clearUser function to clear the user's pins in the
 * database when the button is clicked.
 *
 * @returns div button that on click clears pins
 */
export default function ClearPins() {
  // const [words, setWords] = useState<string[]>([]);

  const USER_ID = getLoginCookie() || "";

  return (
    <div className="firestore-demo">
      {/* Receive user input for search function */}
      <button aria-label="northcampusbutton" onClick={async () => {
          await addParam("northcampus");
          // document.querySelector('.northcampusbutton').classList.toggle('button-clicked');
        }}
      > {/* Maybe we can have like multiple buttons and each 
      one the user picks well include in their desires? */}
        North campus
      </button>
      <button aria-label="southcampusbutton" onClick={async () => {
          await addParam("southcampus");
        }}
      >
        South campus
      </button>
      <button 
        onClick={async () => {
          // - query the backend to clear the user's words
          // - clear the user's pins in the database
          // await loungeLocator(); // with given parameters,
          //maybe we use data of buttons which have been clicked?
        }}
      >
        Input search to backend...
      </button>
      <p></p>
    </div>
  );
}
