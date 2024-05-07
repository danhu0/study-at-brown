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
    <Slider {...settings}>
      {props.images.map((image, index) => (
        <img aria-label="lounge-image" key={index} src={image} alt={"Fetching image"} />
      ))}
    </Slider>
  );
}
