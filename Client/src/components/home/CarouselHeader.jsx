import Slider from "react-slick";

export default function CarouselHeader() {
  var settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
  };

  return (
    <>
    
      <div className="main-banner header-text" id="top">
        <div className="Modern-Slider">
          <Slider {...settings}>
            <div className="item item-1">
              <div className="img-fill">
                  <div className="text-content">
                    <h6>soluciones rápidas y efectivas</h6>
                    <h4>Servicios de Fontanería<br/>&amp; Reparaciones</h4>
                    <p>Nuestra empresa de fontanería ofrece servicios integrales para hogar y negocios. Disponibilidad 24/7 y garantía en todas nuestras reparaciones. Contacta con nosotros para soluciones inmediatas.</p>
                    <a href="contact.html" className="filled-button">contáctanos</a>
                  </div>
              </div>
            </div>
        
            <div className="item item-2">
              <div className="img-fill">
                  <div className="text-content">
                    <h6>expertos en el sector</h6>
                    <h4>Instalación<br/>&amp; Mantenimiento</h4>
                    <p>Contamos con un equipo de profesionales altamente cualificados para la instalación y mantenimiento de sistemas de fontanería. Aseguramos un trabajo de calidad y duradero.</p>
                    <a href="services.html" className="filled-button">nuestros servicios</a>
                  </div>
              </div>
            </div>
          
            <div className="item item-3">
              <div className="img-fill">
                  <div className="text-content">
                    <h6>comprometidos con la calidad</h6>
                    <h4>Diagnóstico<br/>&amp; Soluciones Innovadoras</h4>
                    <p>Utilizamos tecnología de vanguardia para diagnosticar y resolver problemas de fontanería de forma eficiente. Nuestro compromiso es ofrecerte las mejores soluciones adaptadas a tus necesidades.</p>
                    <a href="about.html" className="filled-button">conoce más</a>
                  </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </>
  );
}
