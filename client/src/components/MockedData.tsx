import { CampusPosition, PlaceboxProps } from "./Placebox";

export const MockedData: PlaceboxProps[] = [
  {
    title: "CIT [Dummy]",
    description: "CIT Rooms on the fifth floor",
    google_link:
      "https://www.google.com/maps/place/Thomas+J.+Watson+Sr.+Center+for+Information+Technology,+115+Waterman+St,+Providence,+RI+02912/@41.8269387,-71.4021372,17z/data=!3m1!4b1!4m6!3m5!1s0x89e4453b529c2f87:0x99037ce1419dbf7c!8m2!3d41.8269387!4d-71.3995623!16s%2Fg%2F1v2kyfqz?entry=ttu",
    images: ["src/MockedAssets/cit.jpg"],
    natural_light_level: 3,
    noise_level: 5,
    food_available: ["coffee", "vending machines"],
    view: false,
    private: true,
    hours: [["9-5"], ["9-5"], ["9-5"], ["9-5"], ["9-5"], ["9-5"], ["9-5"]],
    comfort: 7,
    lat: 41.8270985943306,
    long: -71.39958375767155,
    campusposition: CampusPosition.SOUTH,
  },
  {
    title: "Rockefeller Library [Dummy]",
    description: "Anywhere in the library :)",
    google_link:
      "https://www.google.com/maps/place/John+D.+Rockefeller,+Jr.+Library/@41.8257007,-71.4051436,15z/data=!4m6!3m5!1s0x89e44446ec7c0d51:0x2fde92d441a35057!8m2!3d41.8257007!4d-71.4051436!16s%2Fm%2F047mq5j?entry=ttu",
    images: ["src/MockedAssets/Rock.jpg"],
    natural_light_level: 7,
    noise_level: 2,
    food_available: ["coffee", "vending machines"],
    view: true,
    private: true,
    hours: [["9-5"], ["9-5"], ["9-5"], ["9-5"], ["9-5"], ["9-5"], ["9-5"]],
    comfort: 7,
    lat: 41.826084453143125,
    long: -71.40522943068625,
    campusposition: CampusPosition.SOUTH,
  },

  {
    title: "German Studies Department [Dummy]",
    description: "German Studies First Floor Library",
    google_link:
      "https://www.google.com/maps/place/190+Hope+Street,+Providence,+RI+02906/data=!4m2!3m1!1s0x89e44524d9d57cd7:0x3dae70c5003edd4e?sa=X&ved=1t:242&ictx=111",
    images: [
      "src/MockedAssets/GermanStudies_1.jpg",
      "src/MockedAssets/GermanStudies_2.jpg",
    ],
    natural_light_level: 9,
    noise_level: 3,
    food_available: ["coffee"],
    view: true,
    private: true,
    hours: [["9-5"], ["9-5"], ["9-5"], ["9-5"], ["9-5"], ["9-5"], ["9-5"]],
    comfort: 10,
    lat: 41.82768781809791,
    long: -71.39753208650706,
    campusposition: CampusPosition.SOUTH,
  },

  {
    title: "Ceremony [Dummy]",
    description: "Must I say more :)",
    google_link:
      "https://www.google.com/maps/place/Ceremony/@41.8285895,-71.3997176,15z/data=!4m2!3m1!1s0x0:0x3eb1e5885a840ab8?sa=X&ved=1t:2428&ictx=111&cshid=1713672763848988",
    images: ["src/MockedAssets/Ceremony.jpg"],
    natural_light_level: 7,
    noise_level: 8,
    food_available: ["coffee"],
    view: true,
    private: false,
    hours: [["9-5"], ["9-5"], ["9-5"], ["9-5"], ["9-5"], ["9-5"], ["9-5"]],
    comfort: 7,
    lat: 41.8286774107909,
    long: -71.39964250136988,
    campusposition: CampusPosition.OFFCAMPUS,
  },
];
