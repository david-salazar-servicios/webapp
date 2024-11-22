import React from 'react';
import Slider from 'react-slick';

const ServicesCarousel = ({ images }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  return (
    <div className="services-carousel">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index}>
            <img
              src={image.link}
              alt={`Slide ${index}`}
              className="carousel-image"
              referrerPolicy="no-referrer"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ServicesCarousel;
