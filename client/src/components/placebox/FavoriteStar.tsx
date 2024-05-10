import { useEffect, useState } from "react";
import { addLounge, isFavorited } from "../../utils/api";
import { PlaceboxProps } from "./Placebox";

export interface FavoriteStarProps {
  lounge: PlaceboxProps;
}
/**
 * @param props lounge, PlaceboxProps
 * @returns the star emoji, highlighted if it is already favorited.
 * acts as a button so the user may favorite lounge if not already done
 */
export default function FavoriteStar(props: FavoriteStarProps) {
  const [favorited, setFavorited] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      const response = await isFavorited(props.lounge.id);
      setFavorited(response["isFavorited"]);
    };
    fetchData();
  }, []);
  const toggleFavorite = async () => {
    await addLounge(props.lounge);
    setFavorited(true);
  };
  return (
    <div onClick={toggleFavorite}>
      {favorited ? (
        <label aria-label="star-button" className="favoritedstar">
          ⭐
        </label>
      ) : (
        <label aria-label="star-button" className="NOTfavoritedstar">
          ⭐
        </label>
      )}
    </div>
  );
}
