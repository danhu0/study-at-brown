/**
 * Each lounge must be printed out in its own box
 */

import { addLounge } from "../../utils/api";
import FavoriteStar from "./FavoriteStar";
import { Images } from "../ImageDirectory";
import { getAttributes } from "./Attributes";
import Carousel from "./Carousel/Carousel";
import Reviews from "./Reviews";

/**
 * The attributes needed to build a placebox
 */
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
  lat: string;
  long: string;
  building: string;
  study_room: string;
  google_link: string;
  distance: string;
  campus_position: string;
}

/**
 * An individual lounge component displaying the title, a google link, a list of attributes,
 * corresponding images, and a favorite button.
 *
 * @param props
 * @returns an individual placebox
 */
export default function getLoungeBox(props: PlaceboxProps) {
  // This is the favorites button
  async function starButtonHandler() {
    await addLounge(props);
    alert(props.title + " added to favorites");
  }

  return (
    <div className="placebox" aria-label="placebox">
      <h3>
        {props.title + " [" + props.distance + "]"}
        <FavoriteStar lounge={props}></FavoriteStar>
      </h3>
      <p>{props.description}</p>
      <div className="attributes-container" aria-label="attributes-container">
        <p className="attributes" aria-label="attributes">
          {getAttributes(props).join(", ")}
        </p>
      </div>
      <a
        target="_blank"
        //  opens in new tab with target _blank
        href={props.google_link}
      >
        {" "}
        Find it
      </a>
      <p></p>
      <div className="carousel-container" aria-label="carousel-container">
        <Carousel images={Images[props.id]} />
        <Reviews loungeid={props.id}></Reviews>
      </div>
    </div>
  );
}

/**
 * Calculates distance using a backend handler which queries Google Maps' API
 *
 * @param currentLocation - the user's current location
 * @param targetLat - the desired latitude
 * @param targetLong - the desired longitude
 * @returns the distance between the current location and the target
 */
export async function getDistance(
  currentLocation: GeolocationCoordinates,
  targetLat: string,
  targetLong: string
) {
  // Preparting to send a query through our backend to Google!
  let body = await fetch(
    "http://localhost:3232/get-distance?current_lat=" +
      currentLocation.latitude +
      "&current_long=" +
      currentLocation.longitude +
      "&target_lat=" +
      targetLat +
      "&target_long=" +
      targetLong
  );
  const json = await body.json();

  // Interpret the result
  let distance = json["distance"]["rows"][0]["elements"][0]["distance"]["text"];
  return distance;
}
