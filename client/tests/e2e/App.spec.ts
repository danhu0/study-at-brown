import { expect, test } from "@playwright/test";
import { clearUser } from "../../src/utils/api";

/**
  The general shapes of tests in Playwright Test are:
    1. Navigate to a URL
    2. Interact with the page
    3. Assert something about the page against your expectations
  Look for this pattern in the tests below!
 */

const SPOOF_UID = "mock-user-id";

test.beforeEach(
  "add spoof uid cookie to browser",
  async ({ context, page }) => {
    // - Add "uid" cookie to the browser context
    await context.addCookies([
      {
        name: "uid",
        value: SPOOF_UID,
        url: "http://localhost:8000",
      },
    ]);

    // wipe everything for this spoofed UID in the database.
    await clearUser(SPOOF_UID);
  }
);

/**
 * Don't worry about the "async" yet. We'll cover it in more detail
 * for the next sprint. For now, just think about "await" as something
 * you put before parts of your test that might take time to run,
 * like any interaction with the page.
 */
test("on page load, I see the maps screen and skip auth.", async ({
  page,
}) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
  await expect(page.getByText("Maps")).toBeVisible();
  await expect(page.getByText("Map")).toBeVisible();
  await expect(page.getByText("Clear Pins")).toBeVisible();
  await expect(page.getByText("Clear Pins (CLICK ME CLICK ME")).toBeVisible();
});

test("load the page, click the map button, i can see the map. click back and forth multiple times!", async ({
  page,
}) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
  await page.click("text=Map");
  await expect(page.getByTitle)
  let mapDiv = await page.$('div.map');
  expect(mapDiv).toBeTruthy();

  //click back
  await page.click("text=Clear Pins");
  await expect(page.getByText("Clear Pins (CLICK ME CLICK ME)")).toBeVisible();

  //back to the map
  await page.click("text=Map");
  await expect(page.getByTitle)
  mapDiv = await page.$('div.map');
  expect(mapDiv).toBeTruthy();
});

test("load the page, click the map button. drop a couple pins, clear pins, go back", async ({
  page,
}) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
  await page.click("text=Map");
  await expect(page.getByTitle)
  let mapDiv = await page.$('div.map');
  expect(mapDiv).toBeTruthy();
  await page.click("div.map");
  let markers = await page.$$('Marker');
  expect(markers.length).toBe(1);
  await page.click("div.map");
  await page.reload();
  markers = await page.$$('Marker');
  expect(markers.length).toBe(2);
  
  //click back
  await page.click("text=Clear Pins");
  await expect(page.getByText("Clear Pins (CLICK ME CLICK ME)")).toBeVisible();
  await page.click("Clear Pins (CLICK ME CLICK ME)");
  await page.click("Clear Pins (CLICK ME CLICK ME)");


  //back to the map
  await page.click("text=Map");
  await expect(page.getByTitle)
  mapDiv = await page.$('div.map');
  expect(mapDiv).toBeTruthy();
  expect(markers.length).toBe(0);
  await page.reload();
  await page.click("div.map");
  markers = await page.$$('Marker');
  expect(markers.length).toBe(1);
});

test("load the page, click the map button. drag the map around", async ({
  page,
}) => {
  await page.goto("http://localhost:8000/");
  await page.click("text=Map");
  await expect(page.getByTitle)
  let mapDiv = await page.$('.map');
  expect(mapDiv).toBeTruthy();


  const startX = 700;
  const startY =  700;
  const endX = startX + 100;
  const endY = startY + 100; 

  await page.mouse.move(startX, startY);
  await page.mouse.down(); 
  await page.mouse.move(endX, endY); 
  await page.mouse.up();
  expect(mapDiv).toBeTruthy();


  await page.click("text=Clear Pins");
  await expect(page.getByText("Clear Pins (CLICK ME CLICK ME)")).toBeVisible();
  await page.click("Clear Pins (CLICK ME CLICK ME)");

  await page.click("text=Map");
  await expect(page.getByTitle)
  mapDiv = await page.$('.map');
  expect(mapDiv).toBeTruthy();


  await page.mouse.move(startX, startY);
  await page.mouse.down(); 
  await page.mouse.move(endX, endY); 
  await page.mouse.up();
  expect(mapDiv).toBeTruthy();
});