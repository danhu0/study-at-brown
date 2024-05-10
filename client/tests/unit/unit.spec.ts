import { expect, test } from "vitest";
import  "../../src/utils/api";
import { addLounge, addReview, clearUser, getLounges, getReviews } from "../../src/utils/api";
import { MockedData } from "../../src/components/MockedData";

const SPOOF_UID = "mock-user-id";


// add cookies for mocked user first

test("clear user, get empty pins test", async () => {
  const clear = await clearUser()  
  expect(clear).toEqual({"response_type":"success"})
});

test("add lounge works and stays for user", async () => {
  await clearUser()  
  const addlounge = await addLounge(MockedData[0])
  expect(addlounge).toEqual({"spot":{"id":1},"response_type":"success"})
  const getLoungess = await getLounges()
  expect(getLoungess).toContain({"response_type":"success"})
});

test("add review, fetch review", async () => {
  await clearUser()  
  const addingReview = await addReview(1000, "This is the best place ever")
  expect(addingReview).toEqual({"review":{"uid":"mock","review":"This is the best place ever"},"response_type":"success","spot-id":1})
  const reviews = await getReviews(1000)
  expect(reviews).toEqual({"reviews":[{"uid":"mock","review":"This is the best place ever"}],"response_type":"success"})

  // adding another review for same place
  const adding2Review = await addReview(1000, "This is the best place ever from another person")
  expect(adding2Review).toEqual({"review":{"uid":"mock","review":"This is the best place ever from another person"},"response_type":"success","spot-id":1})

  const reviews2 = await getReviews(1000)
  expect(reviews2).toEqual({"reviews":[{"uid":"mock","review":"This is the best place ever"}, {"uid":"mock","review":"This is the best place ever from another person"}],"response_type":"success"})
});

