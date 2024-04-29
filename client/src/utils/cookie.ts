import Cookies from "js-cookie";

// TODO: FIRESTORE PART 2:
// - Fill in these functions to add cookie functionality to the firebase login.

export function addLoginCookie(uid: string): void {
  Cookies.set("uid", uid);
}

export function removeLoginCookie(): void {
  Cookies.remove("uid");
}

export function getLoginCookie(): string | undefined {
  return Cookies.get("uid");
}