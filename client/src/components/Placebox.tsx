/**
 * Each lounge must be printed out in its own box
 */

import { addLounge } from "../utils/api";
import { getAttributes } from "./Attributes";
import ImageCarousel from "./Carousel";
import { Images } from "./ImageDirectory";

export enum CampusPosition {
  NORTH = "north campus",
  SOUTH = "south campus",
  OFFCAMPUS = "off campus",
}

export interface PlaceboxProps {
  id: number;
  title: string;
  description: string;
  natural_light_level: number;
  noise_level: number;
  outlet_availability: number;
  room_size: number;
  private: number;
  food: number;
  view: boolean;
  comfort: number;
  lat: number;
  long: number;
  building: string;
  study_room: string;
  google_link: string;

  // hours: Array<Array<String>>;

  // campusposition: CampusPosition;
}
export default function getLoungeBox(props: PlaceboxProps) {
  console.log(props.title);
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
        <ImageCarousel images={Images[props.id]} />/{/* </li> */}
        {/* here we will put the table of places, with their images, etcetra */}
      </div>
    </div>
  );
}

export async function getDistance(currentLocation: GeolocationCoordinates) {
  let body = await fetch(
    "https://maps.googleapis.com/maps/api/distancematrix/json?destinations=" +
      currentLocation.latitude +
      "%2C" +
      currentLocation.longitude +
      "&mode=walking&origins=41.82634983767247%2C-71.39780942930045&units=imperial&key=AIzaSyCNIoWlECIQxeENJzxXhoqSj4UtbCe6c1I"
  );
  const json = await body.json();
  let distance = json["rows"]["elements"]["distance"]["text"];
  return distance;
}
