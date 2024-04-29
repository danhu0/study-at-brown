import { Key, useEffect, useState } from "react";
import { MockedData } from "./MockedData";
import { addLounge, clearUser, getLounges } from "../utils/api";
import getLoungeBox, { PlaceboxProps } from "./Placebox";

export default function GetUserData() {
//   const USER_ID = getLoginCookie() || "";
  const [mocked, setMocked] = useState(false);
  const [lounges, setLounges] = useState<PlaceboxProps[]>([]);

  async function handleSearchSubmit() {
    setMocked(true);
  }

  useEffect(() => {
    getLounges().then((data) => {
      setLounges(data);
    });
  }, []);

  return (
    <div>
      <button onClick={() => clearUser()}>Clear Favorites </button>
      {lounges.map((data: PlaceboxProps, index: number) => (
        <div className="lounge" key={index}>
          {getLoungeBox(data)}
        </div>
      ))}
{/* {lounges.map((data: String, index: number) => (
        <div className="lounge" key={index}>
          <p>data</p>
        </div>
      ))}      */}
       <p>Review this website/ give us place suggestions!</p>
      <input className="reviewInput"></input>
      <button onClick={() => {}}>Submit </button> 
      {/* Not sure where these suggestions will go yet */}
    </div>
  );
}
