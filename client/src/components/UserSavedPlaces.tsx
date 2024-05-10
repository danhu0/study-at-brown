import { Key, useEffect, useState } from "react";
import { MockedData } from "./MockedData";
import { addLounge, clearUser, deserializeFavoritesResponse, getLoungeData, getLounges } from "../utils/api";
import getLoungeBox, { PlaceboxProps } from "./Placebox";

export default function GetUserData() {
  //   const USER_ID = getLoginCookie() || "";
  const [mocked, setMocked] = useState(false);
    const [lounges, setLounges] = useState<PlaceboxProps[]>([]);
  const [loungeIDS, setLoungeIDS] = useState<string[]>([]);
  // list of ids
  async function handleSearchSubmit() {
    setMocked(true);
  }

  useEffect(() => {
    getLounges().then((data) => {
      if (data["saved-spots"]) {
        setLounges(deserializeFavoritesResponse(data))
        // setLounges(data["saved-spots"])
      }
    });
  }, []);
  const handleClearFavorites = () => {
    clearUser();
    setLounges([]);
  };

  return (
    <div>
      <button className="button" onClick={() => handleClearFavorites()}>Clear Favorites </button>
      <div className="lounges-container">
      {lounges.map((lounge, index) => (
        <div key={index}>
            {getLoungeBox(lounge)}
        </div> 
        
      ))}</div>
      {/* {lounges.map((data: PlaceboxProps, index: number) => (
        <div className="lounge" key={index}>
          {getLoungeBox(data)}
        </div>
      ))} */}
      {/* {lounges.map((data: String, index: number) => (
        <div className="lounge" key={index}>
          <p>data</p>
        </div>
      ))}      */}
      {/* <p className="reviewprompt">
        Review this website/ give us place suggestions!
      </p>
      <input className="reviewInput"></input>
      <button className="button" onClick={() => {}}>Submit </button> */}
      {/* Not sure where these suggestions will go yet */}
    </div>
  );
}
