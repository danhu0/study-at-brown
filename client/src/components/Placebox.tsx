/**
 * Each lounge must be printed out in its own box
 */

import { addLounge } from "../utils/api";
import { getAttributes } from "./Attributes";
import ImageCarousel from "./Carousel";

export enum CampusPosition {
  NORTH = "north campus",
  SOUTH = "south campus",
  OFFCAMPUS = "off campus",
}

export interface PlaceboxProps {
  title: string;
  description: string;
  google_link: string;
  images: string[];
  natural_light_level: number;
  noise_level: number;
  food_available: Array<String>;
  view: boolean;
  private: boolean;
  hours: Array<Array<String>>;
  comfort: number;
  lat: number;
  long: number;
  campusposition: CampusPosition;
}

export default function getLoungeBox(props: PlaceboxProps) {
  return (
    <div className="placebox">
      {/* <li> */}
      <h3>{props.title}</h3>
      <p>{props.description}</p>
      <div className="attributes-container">
        <p className="attributes">{getAttributes(props).join(", ")}</p>
      </div>
      <a
        target="_blank"
        //  opens in new tab with target _blank
        href={props.google_link}
      >
        {" "}
        Find it
      </a>
      <button
        onClick={() => addLounge(props)}
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
