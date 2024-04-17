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
      {/* Clear words button */}
      <button
        onClick={async () => {
          // - query the backend to clear the user's words
          // - clear the user's pins in the database
          await clearUser();
        }}
      >
        Clear Pins (CLICK ME CLICK ME)
      </button>
      <p></p>
    </div>
  );
}
