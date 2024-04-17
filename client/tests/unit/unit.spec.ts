import { expect, test } from "@playwright/test";
import { clearUser } from "../../src/utils/api";

test("1 + 2 should be 3", () => {
  expect(1 + 2).toBe(3);
});

const SPOOF_UID = "mock-user-id";

test.beforeEach(
  "add spoof uid cookie to browser",
  async ({ context, page }) => {
    // - Add "uid" cookie to the browser context
    await context.addCookies([
      {
        name: "uid",
        value: SPOOF_UID,
        url: "http://localhost:3232",
      },
    ]);

    // wipe everything for this spoofed UID in the database.
    await clearUser(SPOOF_UID);
  }
);

function countWordFrequency(mainString, substring): number {
  const regex = new RegExp(substring, 'g');
  const matches = mainString.match(regex);
  return matches ? matches.length : 0;
}

test("no args set-geodata using mocked data", async ({page,}) => {
  await page.goto("http://localhost:3232/set-geodata");

  const jsonText2 = await page.textContent('body');
  expect(jsonText2 != null)
  expect(countWordFrequency(jsonText2?.toLowerCase(), "\"feature")).toBe(32)

  // Notice: http, not https! Our front-end is not set up for HTTPs.
  await page.goto("http://localhost:3232/get-geodata");

  const jsonText = await page.textContent('body');
  expect(jsonText != null)
  expect(countWordFrequency(jsonText?.toLowerCase(), "\"feature")).toBe(32)
});

test("bounding box and keyword search", async({page,}) => {
  //out of bounds
  await page.goto("http://localhost:3232/set-geodata?minlat=-1000&minlong=567&maxlat=45&maxlong=12345678");
  const t1 = await page.textContent('body');
  expect(t1).toContain("failure")

  //not all params
  await page.goto("http://localhost:3232/set-geodata?minlat=-10");
  const t2 = await page.textContent('body');
  expect(t2).toContain("failure")

  //incorrect params
  await page.goto("http://localhost:3232/set-geodata?keyword=fgh&minlat=9");
  const t3 = await page.textContent('body');
  expect(t3).toContain("failure")

  //coords cannot parse to a number
  await page.goto("http://localhost:3232/set-geodata?minlat=hello&minlong=not&maxlat=a&maxlong=number");
  const t4 = await page.textContent('body');
  expect(t4).toContain("failure")

  //successful bounding coords
  await page.goto("http://localhost:3232/set-geodata?minlat=42&maxlat=43&minlong=-108&maxlong=-80");
  const t5 = await page.textContent('body');
  expect(countWordFrequency(t5?.toLowerCase(), "\"feature")).toBe(777)

  //successful bounding coords
  await page.goto("http://localhost:3232/set-geodata?keyword=boston");
  const t6 = await page.textContent('body');
  expect(countWordFrequency(t6?.toLowerCase(), "\"feature")).toBe(61)
})

test("pins", async({page,}) => {
  //tests adding, listing, then clearing pins
  await page.goto("http://localhost:3232/add-pin?lat=25&long=3");
  await page.goto("http://localhost:3232/add-pin?lat=35&long=1");
  await page.goto("http://localhost:3232/list-pins");

  const t1 = await page.textContent('body');
  expect(t1).toContain("pin-1")

  await page.goto("http://localhost:3232/clear-user");
  await page.goto("http://localhost:3232/list-pins");

  const t2 = await page.textContent('body');
  expect(t2).not.toContain("pin-1")

  //repeat test making sure that the firebase handlers and the geodata handlers work in same test
  await page.goto("http://localhost:3232/set-geodata?minlat=-10");
  const t3 = await page.textContent('body');
  expect(t3).toContain("failure")
})