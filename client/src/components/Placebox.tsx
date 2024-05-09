/**
 * Each lounge must be printed out in its own box
 */

import { useEffect, useState } from "react";
import { addLounge } from "../utils/api";
import { getAttributes } from "./Attributes";
import ImageCarousel from "./Carousel";
import { Images } from "./ImageDirectory";
import Popup from "react-map-gl/dist/esm/components/popup";

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
  lat: string;
  long: string;
  building: string;
  study_room: string;
  google_link: string;
  distance: string;

  // hours: Array<Array<String>>;

  // campusposition: CampusPosition;
}

const PlacePopup = ({ description }: { description: string }) => {
  //  ({
  return (
    <div className="popup">
      <p>{description}</p>
      {/* <button onClick={onClose}>Close</button> */}
    </div>
  );
};
// })

export default function getLoungeBox(props: PlaceboxProps) {
  async function starButtonHandler() {
    alert(props.title + " added to favorites");
    await addLounge(props);
  }
  function popupHandler() {
    return <p>hi</p>;
  }
  return (
    <div className="placebox" aria-label="placebox">
      {/* <li> */}
      <h3>{props.title + " [" + props.distance + "]"}</h3>
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
      {/* {isFavorited(props.id)} then we can have the button, else remove favorited*/}
      <button
        onClick={() => starButtonHandler()}
        className="starbutton"
        aria-label="star-button" //allows user to add to favorites list
      >
        {" "}
        ⭐{" "}
      </button>
      <p></p>
      <div className="carousel-container" aria-label="carousel-container">
        <ImageCarousel images={Images[props.id]} />
        {/* </li> */}
        {/* here we will put the table of places, with their images, etcetra */}
      </div>
    </div>
  );
}

export async function getDistance(
  currentLocation: GeolocationCoordinates,
  targetLat: string,
  targetLong: string
) {
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
  let distance = json["distance"]["rows"][0]["elements"][0]["distance"]["text"];
  return distance;
}
