import Cookies from "js-cookie";

// TODO: FIRESTORE PART 2:
// - Fill in these functions to add cookie functionality to the firebase login.

export function addLoginCookie(uid: string): void {
  // TODO: fill out!
  Cookies.set("uid", uid);
}

export function removeLoginCookie(): void {
  // TODO: fill out!
  Cookies.remove("uid");
}

export function getLoginCookie(): string | undefined {
  // TODO: fill out!
  return Cookies.get("uid");
}