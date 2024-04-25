import { useState } from "react";

export default function SearchHomePage() {
  // const USER_ID = getLoginCookie() || "";
  const [mocked, setMocked] = useState(false);

  function handleSearchSubmit() {
    setMocked(true);
    //const myPlaceId = document.getElementById("myplace");
  }

  return (
    <div>
      <p>HERE ARE MY FAVORITE PLACES, AS A USER: IN ORDER!!!! </p>
      <p> YOU MIGHT POTENTIALlY ALSO FIND MY REVIEWS HERE!!</p>
      <p> A PINNED MAP????? </p>

    </div>
  );
}
