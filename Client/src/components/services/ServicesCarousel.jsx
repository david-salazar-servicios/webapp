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
    <Slider {...settings}>
      {images.map((image, index) => (
        <div key={index}>
          <img
            src={image.link}
            alt={`Slide ${index}`}
            className="d-block w-100"
            style={{
              height: '500px',
              objectFit: 'cover',
              borderRadius: '15px' // Add border-radius here
            }}
            referrerPolicy="no-referrer"
          />
        </div>
      ))}
    </Slider>
  );
};

export default ServicesCarousel;
