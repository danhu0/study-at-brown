/**
 * Each lounge must be printed out in its own box 
 */

import { ReactComponentElement } from "react";

export default function getRelavantLounges(placehtml: string) {
//this will essentially query backend for each of these items
    return (
        <div className="placebox">
  {/* <li> */}
    <h3>
      My location
    </h3>
    <p>
      Brief Description
    </p>
    <p>
      Some more words
    </p> 
     <a target="_blank" 
    //  opens in new tab with target _blank
     href="https://www.google.com/maps/place/60+Manning+St,+Providence,+RI+02906/@41.8269281,-71.3988325,17z/data=!3m1!4b1!4m6!3m5!1s0x89e445253148df43:0x296b87a6be1982ab!8m2!3d41.8269281!4d-71.3962576!16s%2Fg%2F11cpgjzvxr?entry=ttu"> Find it</a>
<button className="starbutton" //allows user to add to favorites list
> ⭐ </button> 

<p></p>
    <img src="/wallpaper.png" alt="Wallpaper" />
  {/* </li> */}
   {/* here we will put the table of places, with their images, etcetra */}
</div>);
}
