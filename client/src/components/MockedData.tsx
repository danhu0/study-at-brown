import { PlaceboxProps } from "./Placebox";

export const MockedData: PlaceboxProps[] = [
  {
    title: "CIT [Dummy]",
    description: "CIT Rooms on the fifth floor",
    attributes: "Bright lighting, Quiet, Academic",
    google_link:
      "https://www.google.com/maps/place/Thomas+J.+Watson+Sr.+Center+for+Information+Technology,+115+Waterman+St,+Providence,+RI+02912/@41.8269387,-71.4021372,17z/data=!3m1!4b1!4m6!3m5!1s0x89e4453b529c2f87:0x99037ce1419dbf7c!8m2!3d41.8269387!4d-71.3995623!16s%2Fg%2F1v2kyfqz?entry=ttu",
    images: ["src/MockedAssets/cit.jpg"],
  },
  {
    title: "Rockefeller Library [Dummy]",
    description: "Anywhere in the library :)",
    attributes: "Natural Light, Quiet, Academic, Coffee available",
    google_link:
      "https://www.google.com/maps/place/John+D.+Rockefeller,+Jr.+Library/@41.8257007,-71.4051436,15z/data=!4m6!3m5!1s0x89e44446ec7c0d51:0x2fde92d441a35057!8m2!3d41.8257007!4d-71.4051436!16s%2Fm%2F047mq5j?entry=ttu",
    images: ["src/MockedAssets/Rock.jpg"],
  },

  {
    title: "German Studies Department [Dummy]",
    description: "German Studies First Floor Library",
    attributes: "Natural Light, Usually Empty, Academic, Departmental",
    google_link:
      "https://www.google.com/maps/place/190+Hope+Street,+Providence,+RI+02906/data=!4m2!3m1!1s0x89e44524d9d57cd7:0x3dae70c5003edd4e?sa=X&ved=1t:242&ictx=111",
    images: [
      "src/MockedAssets/GermanStudies_1.jpg",
      "src/MockedAssets/GermanStudies_2.jpg",
    ],
  },

  {
    title: "Ceremony [Dummy]",
    description: "Must I say more :)",
    attributes: "Natural Light, Crowded, Ambient Noise, Great Drinks",
    google_link:
      "https://www.google.com/maps/place/Ceremony/@41.8285895,-71.3997176,15z/data=!4m2!3m1!1s0x0:0x3eb1e5885a840ab8?sa=X&ved=1t:2428&ictx=111&cshid=1713672763848988",
    images: ["src/MockedAssets/Ceremony.jpg"],
  },
];
