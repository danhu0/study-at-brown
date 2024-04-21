/**
 * Each lounge must be printed out in its own box
 */

import ImageCarousel from "./Carousel";

export interface PlaceboxProps {
  title: string;
  description: string;
  attributes: string;
  google_link: string;
  images: string[];
}

export default function getRelavantLounges(props: PlaceboxProps) {
  //this will essentially query backend for each of these items
  return (
    <div className="placebox">
      {/* <li> */}
      <h3>{props.title}</h3>
      <p>{props.description}</p>
      <p>{props.attributes}</p>
      <a
        target="_blank"
        //  opens in new tab with target _blank
        href={props.google_link}
      >
        {" "}
        Find it
      </a>
      <button
        className="starbutton" //allows user to add to favorites list
      >
        {" "}
        ⭐{" "}
      </button>
      <p></p>
      <div className="carousel-container">
        <ImageCarousel images={props.images} />/{/* </li> */}
        {/* here we will put the table of places, with their images, etcetra */}
      </div>
    </div>
  );
}
