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
      {Array.isArray(props.images) ? 
      (props.images.map((image, index) => (
        <img key={index} src={image} alt={"alt text goes here"} />
      ))) : 
      Array.from(JSON.parse(props.images)).map((image, index) => (
       <img key={index} src={image} alt={"alt text goes here"} />
      ))}
    </Slider>
  );
}
