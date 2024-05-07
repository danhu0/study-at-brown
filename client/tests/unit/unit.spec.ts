import { expect, test } from "vitest";
import  "../../src/utils/api";
import { beforeEach } from "node:test";
import { addLounge, clearUser } from "../../src/utils/api";

const SPOOF_UID = "mock-user-id";


// add cookies for mocked user first

test("clear user, get empty pins test", async () => {
  const clear = await clearUser()  
  expect(clear).toEqual({"response_type":"success"})
});

test("add lounge works and doesnt work", async () => {
  await clearUser()  
  const addlounge = await addLounge("")
  expect(addlounge).toEqual("")
  const addloungeBad = await addLounge("bad input")
  expect(addloungeBad).toEqual({"response_type":"failure","error":"Cannot parse null string"})
});

test("get lounges works and doesnt work", async () => {
  await clearUser()  
  const getLounges = await getLounges("")
  expect(addlounge).toEqual("")
  const addloungeBad = await addLounge("bad input")
  expect(addloungeBad).toEqual({"response_type":"failure","error":"Cannot parse null string"})
});

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
    encodeURIComponent(attributes.home) +
    "&num_spots=7";

  const response = await fetch(url);

  const json = await response.json();
  return deserializeResponse(json);
}

async function getUserLocation() {
  const location = await new Promise<GeolocationPosition>((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    }
  });
  return location.coords;
}

export async function deserializeResponse(
  response: any
): Promise<PlaceboxProps[]> {
  console.log("HERE");

  const userLocation = await getUserLocation();
  const deserializedResponse = await Promise.all(
    response.best_spots.map(async (spot: any) => {
      const distance = await getDistance(
        userLocation,
        spot.latitude,
        spot.longitude
      );
      return {
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
        distance: distance,
      };
    })
  );
  console.log("HERE");
  return deserializedResponse;
}

export function deserializeFavoritesResponse(response: any): PlaceboxProps[] {
  return response["saved-spots"].map((spot: any) => ({
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


// function countWordFrequency(mainString, substring): number {
//   const regex = new RegExp(substring, 'g');
//   const matches = mainString.match(regex);
//   return matches ? matches.length : 0;
// }

// test("no args set-geodata using mocked data", async ({page,}) => {
//   await page.goto("http://localhost:3232/set-geodata");

//   const jsonText2 = await page.textContent('body');
//   expect(jsonText2 != null)
//   expect(countWordFrequency(jsonText2?.toLowerCase(), "\"feature")).toBe(32)

//   // Notice: http, not https! Our front-end is not set up for HTTPs.
//   await page.goto("http://localhost:3232/get-geodata");

//   const jsonText = await page.textContent('body');
//   expect(jsonText != null)
//   expect(countWordFrequency(jsonText?.toLowerCase(), "\"feature")).toBe(32)
// });

// test("bounding box and keyword search", async({page,}) => {
//   //out of bounds
//   await page.goto("http://localhost:3232/set-geodata?minlat=-1000&minlong=567&maxlat=45&maxlong=12345678");
//   const t1 = await page.textContent('body');
//   expect(t1).toContain("failure")

//   //not all params
//   await page.goto("http://localhost:3232/set-geodata?minlat=-10");
//   const t2 = await page.textContent('body');
//   expect(t2).toContain("failure")

//   //incorrect params
//   await page.goto("http://localhost:3232/set-geodata?keyword=fgh&minlat=9");
//   const t3 = await page.textContent('body');
//   expect(t3).toContain("failure")

//   //coords cannot parse to a number
//   await page.goto("http://localhost:3232/set-geodata?minlat=hello&minlong=not&maxlat=a&maxlong=number");
//   const t4 = await page.textContent('body');
//   expect(t4).toContain("failure")

//   //successful bounding coords
//   await page.goto("http://localhost:3232/set-geodata?minlat=42&maxlat=43&minlong=-108&maxlong=-80");
//   const t5 = await page.textContent('body');
//   expect(countWordFrequency(t5?.toLowerCase(), "\"feature")).toBe(777)

//   //successful bounding coords
//   await page.goto("http://localhost:3232/set-geodata?keyword=boston");
//   const t6 = await page.textContent('body');
//   expect(countWordFrequency(t6?.toLowerCase(), "\"feature")).toBe(61)
// })

// test("pins", async({page,}) => {
//   //tests adding, listing, then clearing pins
//   await page.goto("http://localhost:3232/add-pin?lat=25&long=3");
//   await page.goto("http://localhost:3232/add-pin?lat=35&long=1");
//   await page.goto("http://localhost:3232/list-pins");

//   const t1 = await page.textContent('body');
//   expect(t1).toContain("pin-1")

//   await page.goto("http://localhost:3232/clear-user");
//   await page.goto("http://localhost:3232/list-pins");

//   const t2 = await page.textContent('body');
//   expect(t2).not.toContain("pin-1")

//   //repeat test making sure that the firebase handlers and the geodata handlers work in same test
//   await page.goto("http://localhost:3232/set-geodata?minlat=-10");
//   const t3 = await page.textContent('body');
//   expect(t3).toContain("failure")
// })