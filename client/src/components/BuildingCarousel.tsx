import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import getLoungeBox, { PlaceboxProps } from "./Placebox";

export interface BuildingCarouselProps {
  places: PlaceboxProps[];
}

export default function BuildingCarousel(props: BuildingCarouselProps) {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  return (
    <Slider {...settings}>
      {props.places.map((place, index) => (
        getLoungeBox(place)
        // <img key={index} src={image} alt={"alt text goes here"} />
      ))}
    </Slider>
  );
}
