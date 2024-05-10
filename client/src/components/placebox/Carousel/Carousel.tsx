import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/**
 * These are the props, which we need to build a Carousel component
 */
export interface CarouselProps {
  images: string[];
}

/**
 * Returns a carousel component which we build with the React.js slick library.
 * The carousel allows us to display multiple images in a placebox and seamlessly
 * slide between them.
 */
export default function Carousel(props: CarouselProps) {
  // The settings for the carousel
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <div>
      {props.images != null && props.images.length != 0 ? (
        <Slider {...settings}>
          {props.images.map((image, index) => (
            <img
              className="placecard-image"
              aria-label="lounge-image"
              key={index}
              src={image}
              alt={"Image " + index + " of this study spot"}
            />
          ))}
        </Slider>
      ) : (
        <p>Image not found</p>
      )}
    </div>
  );
}
