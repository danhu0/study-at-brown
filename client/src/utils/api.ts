import { PlaceboxProps, getDistance } from "../components/placebox/Placebox";
import { getLoginCookie } from "./cookie";
import { SearchParameters } from "../components/search/SearchParameters";
import { userLocation } from "../components/search/SearchLounge";
const HOST = "http://localhost:3232";

/**
 * Easy API Query function
 *
 * @param endpoint
 * @param query_params
 * @returns the result of the query
 */
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
 * Function which queries the add-lounge endpoint
 *
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
 * Queries the get-reviews for a specific place
 *
 * @param id - the id of a location
 * @returns the reviews associated with that location
 */
export async function getReviews(id: number) {
  return await queryAPI("get-reviews", {
    "spot-id": id.toString(), // what if multiple lounges named same thing?
  });
}

/**
 * Queries the backend API to add a review
 *
 * @param id - the id of the place we're reviewing
 * @param review - the content of the review
 * @returns the result of the query
 */
export async function addReview(id: number, review: string) {
  return await queryAPI("add-review", {
    uid: getLoginCookie() || "",
    "spot-id": id.toString(),
    review: review,
  });
}

/**
 * Function which queries the get-user endpoint.
 * @returns a promise that resolves to the response from the server
 */
export async function getLounges() {
  return await queryAPI("get-user", {
    uid: getLoginCookie() || "",
  });
}

/**
 * Queries the backend API to get data for a lounge id
 *
 * @param id - the id of the place we're reviewing
 * @param review - the content of the review
 * @returns the result of the query
 */
export async function getLoungeData(id: string) {
  //number in string format
  return await queryAPI("get-data", {
    id: id,
  });
}

/**
 * Queries the backend API to get reccomendations given attributes
 *
 * @param id - the id of the place we're reviewing
 * @param review - the content of the review
 * @returns the result of the query
 */
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
    encodeURIComponent(attributes.home) +
    "&num_spots=7";

  const response = await fetch(url);

  const json = await response.json();
  return deserializeResponse(json, "best_spots");
}

/**
 * Converts the response into Placebox Props so we can construct a Placebox
 * @param response - the response from the API
 * @param spotsType
 * @returns - the deserialized response
 */
export async function deserializeResponse(response: any, spotsType: string) {
  const loc = await userLocation;
  const deserializedResponse = await Promise.all(
    response[spotsType].map(async (spot: any) => {
      let distance;
      if (loc) {
        distance = await getDistance(loc, spot.latitude, spot.longitude);
      } else {
        distance = "N/A";
      }
      return {
        id: spot.id,
        title: spot.title,
        description: "", // Description functionality not currently used
        natural_light_level: parseInt(spot.natural_light_level),
        noise_level: parseInt(spot.noise_level),
        outlet_availability: parseInt(spot.outlet_availability),
        room_size: parseInt(spot.room_size),
        private: parseInt(spot.private),
        food: parseInt(spot.food),
        view: spot.view,
        comfort: spot.home,
        lat: parseFloat(spot.latitude),
        long: parseFloat(spot.longitude),
        building: spot.building,
        study_room: "", // Future potential functionality involving study rooms
        google_link: spot.google_link,
        distance: distance,
        campus_position: spot.campus_position,
      };
    })
  );
  return deserializedResponse;
}
