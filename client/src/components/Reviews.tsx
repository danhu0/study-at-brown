import { SetStateAction, useEffect, useState } from "react";
import { PlaceboxProps } from "./Placebox";
import { addReview, getReviews } from "../utils/api";

export interface ReviewsProps {
  loungeid: number;
}
/**
 * 
 * @param props loungeid, number
 * @returns the web items which show the user the reviews for each lounge
 * and also gives them the opportunity to leave reviews of their own
 */
export default function Reviews(props: ReviewsProps) {
  const [reviews, setReviews] = useState<string[]>([]);
  const [showReviews, setShowReviews] = useState<boolean>(false);
  const [reviewInput, setReviewInput] = useState("");

  useEffect(() => {
      const fetchData = async () => {
        const response = await getReviews(props.loungeid)
        setReviews(response["reviews"].map((review: { [x: string]: any; }) => "~~" +review["review"]))
      };
      fetchData();
    }, []);
  const handleShowReviewButton = async () => {
    setShowReviews(!showReviews);
    if (reviews.length == 0) {
      setReviews(["No available reviews for lounge"]);
    }
  };
  const handleReviewInputSubmitButton = async () => {
    if (reviewInput != ''){
    await addReview(props.loungeid, reviewInput);
    setReviewInput('');
    const response = await getReviews(props.loungeid);
    setReviews(
      response["reviews"].map(
        (review: { [x: string]: any }) =>  "    "+ review["review"]
      )
    );}
  };
  return (
    <div className="reviews">
    <div className="reviews-scroll">
      <button className="button" onClick={handleShowReviewButton}>
        {showReviews ? "Hide Reviews" : "See Reviews"}
      </button>

      {showReviews && (
        <div className="reviewslist">
            <p>User Reviews:</p>
          <ul className="listreviewslist">
            {reviews.map((review, index) => (
              <p className="listreviews" key={index}>{review}</p>
            ))}
          </ul>
        </div>
      )}
      <p></p>
      </div>
<div className="reviewinput">
      <input
      placeholder="Leave a review!"
        className="reviewInput"
        value={reviewInput}
        onChange={(e) => setReviewInput(e.target.value)}
      ></input>
      <button className="button" onClick={handleReviewInputSubmitButton}>Submit Review</button>
   </div></div>
  );
}
