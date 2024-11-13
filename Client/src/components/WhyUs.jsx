import React from 'react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import RiegoImage from '../assets/images/slide_01.jpg';

export default () => {
  const sectionStyle = {
    width: "100vw",
    padding: "60px 0",
    position: "relative",
    marginLeft: "calc(50% - 50vw)",
    background: `linear-gradient(rgba(0, 0, 0, 0.70), rgba(37, 37, 37, 0.274)), url(${RiegoImage}) center center / cover no-repeat`,
    backgroundAttachment: "fixed",
    color: "#fff",
  };

  return (
    <section id="why-us" className="why-us">
      <div className="section-title">
        <h2>Por Qué Elegirnos</h2>
      </div>

      <section id="cta" className="cta" style={sectionStyle}>
      <div className="container d-flex justify-content-center align-items-center" data-aos="zoom-in" style={{ height: "100%" }}>
        <div className="row justify-content-center align-items-center" style={{ width: "100%" }}>
          <div className="col-xl-8 d-flex justify-content-center align-items-center">
            <div className="slides" style={{ maxWidth: "1200px", width: "100%" }}>
              <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
              >
                <SwiperSlide>
                  <div className="whyUsItem text-center">
                    <h3 className="mb-3">Compromiso con la Excelencia</h3>
                    <h4 className="mb-3">Garantía de satisfacción y atención personalizada.</h4>
                    <p style={{ fontSize: "1.2rem" }}>
                      Nuestra dedicación a la excelencia y la calidad en cada trabajo nos distingue. Brindamos soluciones efectivas y duraderas, asegurando la máxima satisfacción y atención personalizada para cada uno de nuestros clientes.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="whyUsItem text-center">
                    <h3 className="mb-3">Innovación y Tecnología</h3>
                    <h4 className="mb-3">Adoptamos las últimas tecnologías para ofrecer los mejores resultados.</h4>
                    <p style={{ fontSize: "1.2rem" }}>
                      Estamos en constante actualización, incorporando las últimas innovaciones y tecnologías en nuestros proyectos. Esto nos permite ofrecer soluciones más eficientes, seguras y económicas, adaptándonos a las necesidades específicas de cada cliente.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="whyUsItem text-center">
                    <h3 className="mb-3">Experiencia Comprobada</h3>
                    <h4 className="mb-3">Años de servicio confiable en el mercado.</h4>
                    <p style={{ fontSize: "1.2rem" }}>
                      Nuestra larga trayectoria nos avala como expertos en el campo, con un historial probado de proyectos exitosos y clientes satisfechos.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="whyUsItem text-center">
                    <h3 className="mb-3">Servicio Integral</h3>
                    <h4 className="mb-3">Desde la consulta inicial hasta la finalización del proyecto.</h4>
                    <p style={{ fontSize: "1.2rem" }}>
                      Ofrecemos un servicio completo que cubre todas las fases del proyecto, asegurando una ejecución sin fisuras y a la medida de tus necesidades.
                    </p>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
    </section>
  );
};
