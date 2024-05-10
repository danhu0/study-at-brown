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
 * Function which queries the addLounge endpoint. This function is used to add lounges to the user's favorited data.
 * @param lounge: PlaceboxProps
 */
export async function addLounge(lounge: PlaceboxProps) {
  return await queryAPI("add-lounge", {
    uid: getLoginCookie() || "",
    "spot-id": lounge.id.toString(),
  });
}

/**
 * Function which queries the getReviews endpoint. This function is used to get
 * all the given reviews for a lounge
 * @param id: number, the lounge id
 */
export async function getReviews(id: number) {
  return await queryAPI("get-reviews", {
    "spot-id": id.toString(),
  });
}

/**
 * Function which queries the addReview endpoint. This function is used to add
 * reviews to the lounge. It will be linked to the user's uid so admin may
 * know who added the review
 *
 * @param lounge: PlaceboxProps
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
 * Function which queries the getLounges endpoint. This function is used to
 * get the lounges from the user's favorites.
 *
 * @returns a promise that resolves to the response from the server
 */
export async function getLounges() {
  return await queryAPI("get-user", {
    uid: getLoginCookie() || "",
  });
}

/**
 * Function which queries the getLounge endpoint.
 * This function is used to receive the lounge data from a specific lounge
 *
 * @param id: string, the loung id
 */
export async function getLoungeData(id: string) {
  return await queryAPI("get-data", {
    id: id,
  });
}

/**
 * Function which queries the get-recs endpoint. This function is
 * used to input the search into the backend given the user's parameters
 * using the dropdown interface
 * @param attributes: SearchParameters
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

async function getUserLocation() {
  const location = await new Promise<GeolocationPosition>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
  return location.coords;
}

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

export async function isFavorited(id: number) {
  //number in string format
  return await queryAPI("is-favorited", {
    uid: getLoginCookie() || "",
    "spot-id": id.toString(),
  });
}
