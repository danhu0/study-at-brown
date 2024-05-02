import { PlaceboxProps } from "../components/Placebox";
import { getLoginCookie } from "./cookie";

const HOST = "http://localhost:3232";

async function queryAPI(
  endpoint: string,
  query_params: Record<string, string>
) {
  // query_params is a dictionary of key-value pairs that gets added to the URL as query parameters
  // e.g. { foo: "bar", hell: "o" } becomes "?foo=bar&hell=o"
  const paramsString = new URLSearchParams(query_params).toString();
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
    "spot-id": lounge.id.toString()   // what if multiple lounges named same thing?
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


export async function getLoungeData(id: string) { //number in string format
  return await queryAPI("get-data", {
    id: id,
  });
}
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

