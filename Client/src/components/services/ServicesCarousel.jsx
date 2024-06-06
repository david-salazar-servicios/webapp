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
          <div
            className="d-block w-100"
            style={{
              backgroundImage: `url(${image.link})`,
              height: '500px',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
        </div>
      ))}
    </Slider>
  );
};

export default ServicesCarousel;
