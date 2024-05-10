import { useEffect, useState } from "react";
import { clearUser, deserializeResponse, getLounges } from "../../utils/api";
import getLoungeBox, { PlaceboxProps } from "../placebox/Placebox";

/**
 * The User Favorites Page; contains a button to clear the favorites and
 * displays the placeboxes of all of the user's favorites.
 *
 * @returns The placeboxes representing the user's favorites
 */
export default function GetUserData() {
  const [lounges, setLounges] = useState<PlaceboxProps[]>([]);

  // get the user's favorites from firebase
  useEffect(() => {
    async function fetchData() {
      const data = await getLounges();
      if (data["saved-spots"]) {
        setLounges(await deserializeResponse(data, "saved-spots"));
      }
    }
    fetchData();
  }, []);

  // For clearning favorites
  const handleClearFavorites = () => {
    clearUser();
    setLounges([]);
  };

  // return the button component and the placeboxes
  return (
    <div>
      <button className="button" onClick={() => handleClearFavorites()}>
        Clear Favorites{" "}
      </button>
      <div className="lounges-container">
        {lounges.map((lounge, index) => (
          <div key={index}>{getLoungeBox(lounge)}</div>
        ))}
      </div>
    </div>
  );
}
