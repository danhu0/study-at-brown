# Project Details

Project name: Study @ Brown @ courses@brown.cs.edu.com (Vesuvius Challenge Grand Prize Winner)

Team members: Eitan Zemel (ezemel), Daniel Hu (dhu34), Christopher Butulis (cbutulis), Elizabeth Gresalfi (ergresalf)

Link to repo: https://github.com/danhu0/study-at-brown

# Design Choices

This project is a lounge locator. Its purpose is for when you need to find a spot to study and you're in Brown University and you can't decide where to plop your stuff down. This is for you.

The webpage opens to a random assortment of study spots. The user can search for spots based on certain criteria such as natural light level, noise level, outlet availability, etc. The user can favorite certain spots that they especially like, which will be tied to their Brown account and saved across sessions. If the user allows location access, each spot will display walking distance from the user in minutes. Users can leave reviews on spots that will show up publicly.

We implemented an algorithm to match the user’s query to spots in our database. We first convert the user’s query to a vector and store them in a shared state. We then use cosine similarity to calculate how similar each spot in our database is to the user’s query and return the most suitable study spots. We also use the user’s saved spots to create an average taste vector that is used to supplement queries that do not include preferences for every attribute. The user does not need to fill in every search criteria with a preference, and ones that are ignored will not factor into the cosine similarity (unless filled in by the taste vector).

User must sign in with a Brown Google account for security reasons. The IDs for the spots are stored in a Firebase database. We are using Firebase for ease of use and no SQL. For the information on the spots themselves, we retrieve the ids from Firebase and we query a CSV that stores the rest of the information on the spots locally. We store the pictures for the spots on the client side using a file path structure utilizing the unique spot IDs.

Project uses Moshi for ease of JSON parsing, Apache Commons CSV for CSV parsing, Commons Math3 for the vectorized operations we use when performing our algorithm, and Google Maps API for distance calculations.

For accessibility, the project uses aria-labels and aria-descriptions for integration with screen readers.

# Errors/Bugs

Running the full backend JUnit test suite runs into server issues, so the tests must be run individually.

# Tests

Frontend tests use playwright, integration tests use vite, and backend tests use JUnit.

Frontend:
First comment out these imports in Carousel.tsx:
`import "slick-carousel/slick/slick.css";`
`import "slick-carousel/slick/slick-theme.css";`
To run, cd into client and run
`npx playwright install`
`npm run test`
Unit tests are in tests/unit and end to end tests are in tests/e2e. Both test files use Playwright.

Backend:
Tests are found in server/src/test/java/edu/brown/cs/student/. To run, each test must be run individually.

# How to

To run the backend server, navigate to the server directory and run `./run`.
To run the front end, navigate to the client directory, then run `npm install` and then `npm run start`.

To access the webpage, with both the server and clients running, open http://localhost:8000/ in your preferred browser.

For querying the API directly, the backend server is running on http://localhost:3232/.

Endpoints include get-user, get-recs, get-data, get-hot, add-lounge, clear-user, get-data, get-distance, add-review, get-reviews

Required parameters are marked with an asterisk.

get-user: uid*
get-recs: natural_light_level, noise_level, outlet_availability, room_size, private, food, view, home, uid
get-hot: num_spots
add-lounge: uid*, spot-id*
clear-user: uid*
get-data: id*
get-distance: current_lat*, current_long*, target_lat*, target_long*
add-review: uid*, spot-id*, review*
get-reviews: spot-id\*

Example queries:

- http://localhost:3232/get-recs?natural_light_level=&noise_level=0&outlet_availability=1&room_size=0&private=0&food=0&view=1&home=2 - returns a set of recommendations

For the jsons returned, `response_type` will be set to either "success" or "failure". On success, there will be a "result" field with the json, and on failure, there will be an "error" field with the error message.

# Collaboration

Used React slick [documentation](https://www.npmjs.com/package/react-slick) to implement image carousels.
