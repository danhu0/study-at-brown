import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export interface CarouselProps {
  images: string[];
}

export default function Carousel(props: CarouselProps) {
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
