import { Attributes } from "react";
import { PlaceboxProps } from "../components/Placebox";
import { getLoginCookie } from "./cookie";
import { SearchParameters } from "../components/SearchParameters";
const HOST = "http://localhost:3232";

async function queryAPI(
  endpoint: string,
  query_params: Record<string, string>
) {
  // query_params is a dictionary of key-value pairs that gets added to the URL as query parameters
  // e.g. { foo: "bar", hell: "o" } becomes "?foo=bar&hell=o"
  const paramsString = new URLSearchParams(query_params).toString();
  console.log(paramsString);
  const url = `${HOST}/${endpoint}?${paramsString}`;
  const response = await fetch(url);
  if (!response.ok) {
    console.error(response.status, response.statusText);
  }
  return response.json();
}

/**
 * Function which queries the clear user endpoint. This function is used to clear the user's data.
 * @param uid the user's id
 * @returns a promise that resolves to the response from the server
 */
export async function clearUser(uid: string = getLoginCookie() || "") {
  return await queryAPI("clear-user", {
    uid: uid,
  });
}

/**
 * Function which queries the addCoords endpoint. This function is used to add coordinates to the user's data.
 * @param lat latitude
 * @param long longitude
 */
export async function addLounge(lounge: PlaceboxProps) {
  return await queryAPI("add-lounge", {
    uid: getLoginCookie() || "",
    "spot-id": lounge.id.toString(), // what if multiple lounges named same thing?
  });
}

/**
 * Function which queries the getCoords endpoint. This function is used to get the coordinates from the user's data.
 * @returns a promise that resolves to the response from the server
 */
export async function getLounges() {
  return await queryAPI("get-user", {
    uid: getLoginCookie() || "",
  });
}

export async function getLoungeData(id: string) {
  //number in string format
  return await queryAPI("get-data", {
    id: id,
  });
}

export async function getRecs(attributes: SearchParameters) {
  const url =
    "http://localhost:3232/get-recs?" +
    "natural_light_level=" +
    encodeURIComponent(attributes.natural_light_level) +
    "&noise_level=" +
    encodeURIComponent(attributes.noise_level) +
    "&outlet_availability=" +
    encodeURIComponent(attributes.outlet_availability) +
    "&room_size=" +
    encodeURIComponent(attributes.room_size) +
    "&private=" +
    encodeURIComponent(attributes.private) +
    "&food=" +
    encodeURIComponent(attributes.food) +
    "&view=" +
    encodeURIComponent(attributes.view) +
    "&home=" +
    encodeURIComponent(attributes.home);

  const response = await fetch(url);
  const json = await response.json();
  console.log(json);
  return deserializeResponse(json);
}

export async function deserializeResponse(
  response: any
): Promise<PlaceboxProps[]> {
  return response.best_spots.map((spot: any) => ({
    id: spot.id,
    title: spot.title,
    description: "", // Add description if available
    natural_light_level: parseInt(spot.natural_light_level),
    noise_level: parseInt(spot.noise_level),
    outlet_availability: parseInt(spot.outlet_availability),
    room_size: parseInt(spot.room_size),
    private: parseInt(spot.private),
    food: parseInt(spot.food),
    view: spot.view,
    comfort: 0, // Add comfort if available
    lat: parseFloat(spot.latitude),
    long: parseFloat(spot.longitude),
    building: spot.building,
    study_room: "", // Add study_room if available
    google_link: "", // Add google_link if available
  }));
}

// export async function isFavorited(id: string) { //number in string format
//   return await queryAPI("is-favorited", {
//     uid: getLoginCookie() || "",
//     id: id,
//   });
// }
// /**
//  * Function which queries the addWord endpoint. This function is used to add a word to the user's data.
//  * @param word the word to add
//  * @returns a promise that resolves to the response from the server
//  */
// export async function addWord(word: string) {
//   return await queryAPI("add-word", {
//     uid: getLoginCookie() || "",
//     word: word,
//   });
// }

// /**
//  * Function which queries the getWords endpoint. This function is used to get the words from the user's data.
//  * @returns a promise that resolves to the response from the server
//  */
// export async function getWords() {
//   return await queryAPI("list-words", {
//     uid: getLoginCookie() || "",
//   });
// }
