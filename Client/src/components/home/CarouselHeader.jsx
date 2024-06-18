import Slider from "react-slick";
import React, { useRef, useEffect } from 'react';

export default function CarouselHeader() {
  const sliderRef = useRef();

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        sliderRef.current.slickPlay();  // Reiniciar el autoplay cuando la página es visible
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  var settings = {
    infinite: true,
    speed: 350,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnFocus: false,
    pauseOnHover: false,
    fade: true
  };

  return (   
        <div className="Modern-Slider">
          <Slider {...settings} ref={sliderRef}>
            <div className="item item-1">
              <div className="img-fill"></div>
            </div>
            <div className="item item-2">
              <div className="img-fill"></div>
            </div>
            <div className="item item-3">
              <div className="img-fill"></div>
            </div>
          </Slider>
        </div>
  );
}
