import { expect, test } from "@playwright/test";
import { clearUser } from "../../src/utils/api";

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

test("on page load, I see the home screen and skip auth.", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
  await expect(page.getByText("Study @ Brown")).toBeVisible();
  await expect(page.getByText("Home")).toBeVisible();
  await expect(page.getByText("User's Favorites")).toBeVisible();
  await expect(page.getByText("Send search to backend")).toBeVisible();
  await expect(page.getByText("Noise Level")).toBeVisible();
  await expect(page.getByText("Sign Out")).toBeVisible();

  // checking whether initial buttons/ dropdowns are visible
});

test("load the page, click the user's favorites button, i see that page", async ({
  page,
}) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
  await page.click("text=User's Favorites");
  expect(page.getByTitle);
  await expect(page.getByText("Clear Favorites")).toBeVisible();
  await expect(page.getByText("Sign Out")).toBeVisible();
  await expect(page.getByText("Study @ Brown")).toBeVisible();

  // now when i go back to home page, goes there
  await page.click("text=Home");
  await expect(page.getByText("Noise Level")).toBeVisible();
});

test("load the page, default random places are listed", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("placebox")).toHaveCount(3);
  await expect(page.getByLabel("star-button")).toHaveCount(3);
});

test("after favoriting a lounge, it shows up in user favorites section", async ({
  page,
}) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");

  await expect(page.getByLabel("star-button")).toHaveCount(3);
  await page.getByLabel("star-button").first().click();
  await page.getByLabel("User-favorites-button").click();

  await expect(page.getByLabel("placebox")).toHaveCount(1);
  await expect(page.getByLabel("lounge-image")).toBeVisible();

  //if star-button is visible, placebox is visible too presumably
  await expect(page.getByLabel("star-button")).toBeVisible();
});

test("load the page, sign out, google logged out page", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");
  await expect(page.getByLabel("logout-button")).toBeVisible();
  await page.getByLabel("logout-button").click();
  await expect(page.getByLabel("login-button")).toBeVisible();
});

test("basic input to backend", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");

  await page.getByText("Send Search To Backend").click();

  await expect(page.getByLabel("placebox")).toHaveCount(7);

  await expect(page.getByText("Blue Room")).toBeVisible();
});

test("input to backend using an attribute", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");

  await page.getByLabel("noisedropdown").selectOption("2");

  await page.getByText("Send Search To Backend").click();

  await expect(page.getByLabel("placebox")).toHaveCount(7);

  await expect(page.getByText("Blue Room")).toBeVisible();

  await expect(page.getByText("Bolt")).toBeVisible();

  await expect(page.getByText("Ceremony")).toBeVisible();
});

test("input to backend using two attributes", async ({ page }) => {
  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:8000/");

  await page.getByLabel("noisedropdown").selectOption("0");
  await page.getByLabel("natlightdropdown").selectOption("3");

  await page.getByText("Send Search To Backend").click();

  await expect(page.getByLabel("placebox")).toHaveCount(7);

  await expect(page.getByText("The Hay")).toBeVisible();

  await expect(page.getByText("Rhode Island Hall")).toBeVisible();
});
