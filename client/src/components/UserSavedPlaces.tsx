import { Key, useEffect, useState } from "react";
import { MockedData } from "./MockedData";
import {
  addLounge,
  clearUser,
  deserializeResponse,
  getLoungeData,
  getLounges,
} from "../utils/api";
import getLoungeBox, { PlaceboxProps } from "./Placebox";

export default function GetUserData() {
  //   const USER_ID = getLoginCookie() || "";
  const [lounges, setLounges] = useState<PlaceboxProps[]>([]);
 
  useEffect(() => {
    async function fetchData() {
      const data = await getLounges();
      if (data["saved-spots"]) {
        setLounges(await deserializeResponse(data, "saved-spots"));
      }
    }

    fetchData();
  }, []);

  const handleClearFavorites = () => {
    clearUser();
    setLounges([]);
  };

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
