# Project Details
Project name: Maps

Team members: Eitan Uriel Zemel (ezemel), Daniel Danyi Hu (dhu34)
Total time to complete: 14

Link to repo: https://github.com/cs0320-s24/maps-ezemel-dhu34

# Design Choices
This project is a map-viewing tool designed for working with redlining zoning data. With information sourced from Mapping Inequality, this project overlays colors corresponding to green, yellow, blue, and red housing zones. By querying the API, user can set bounds to display the overlay only for a particular region, either through specifying maximum and minimum longitude and latitude or by searching for a particular keyword.

User must sign in with a Brown Google account for security reasons. User can drop pins on the map, which will sync across sessions unless they clear their pins. The information for the pins is stored in coordinates in a Firebase database. We are using Firebase for ease of use no-SQL.

In order to store the user's API query for bounding the overlay, there are two endpoints, one for setting the geodata and one for getting. They both hold reference to a shared state dependency that is injected that holds the json result of the most recent query. It is initialized to hold all of the information, so on first visit to the webpage, all of the zoning information will be displayed.

Project uses Moshi for ease of json parsing.

For accessibility, the project uses aria-labels and aria-descriptions for integration with screenreaders.

Project caches API responses from bounding box (long and lat bounds), but not keyword search responses. We make use of a Datasource interface and a CacheDatasource wrapper that uses the GeoDatasource and caches responses.

# Errors/Bugs
When zoomed out very very far on the map, the pins are a bit buggy.

# Tests
To run, cd into client and run
    `npx playwright install`
    `npm run test`
Unit tests are in tests/unit and end to end tests are in tests/e2e. Both test files use Playwright.

To run the unit test with mocked data, edit the server file to set up the set-geodata endpoint with
the mocked data source (the line to do this is written and needs to be uncommented).

# How to
To run the backend server, navigate to the server directory and run `.\run`.
To run the front end, navigate to the client directory, then run `npm install` and then `npm run start`.

To access the webpage, with both the server and clients running, open http://localhost:8000/ in your preferred browser.

For querying the API directly, the backend server is running on http://localhost:3232/.

Endpoints withouth arguments include list-pins, clear-user, and get-geodata.
Endpoints with arguments include add-pin and set-geodata.

    add-pin: parameters = lat, long. values must be parseable to floats.

    set-geodata: parameters = EITHER maxlat, maxlong, minlat, minlong OR keyword. All arguments in first set of params must be parseable to floats.

Example queries:

- http://localhost:3232/set-geodata - returns whole geojson file
- http://localhost:3232/set-geodata?maxlat=40.8&minlat=40.7&minlong=-74&maxlong=-73.8 - returns zones within the bounding box
- http://localhost:3232/set-geodata?keyword=school - returns zones with "school" in the description somewhere

For the jsons returned, `response_type` will be set to either "success" or "failure". On success, there will be a "result" field with the json, and on failure, there will be an "error" field with the error message.

# Collaboration

_(state all of your sources of collaboration past your project partner. Please refer to the course's collaboration policy for any further questions.)_
none