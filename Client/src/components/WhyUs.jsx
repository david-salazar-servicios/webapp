import React from 'react';
import { Navigation, Pagination, Scrollbar, A11y, Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import image from '../../src/assets/images/why-us-bg.jpg';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';


// Animation variants
const textVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  fromRightToCenter: { opacity: 1, x: [300, 0] },
};

const boxVariants = {
  hidden: { opacity: 0, x: -300 },
  visible: { opacity: 1, x: 0 },
};

// Title component with animation
const AnimatedTitle = ({ title }) => {
  const [ref, inView] = useInView({});

  return (
    <motion.div
      ref={ref}
      variants={textVariants}
      initial="hidden"
      animate={inView ? "fromRightToCenter" : "hidden"}
      transition={{ duration: 0.5 }}
      className="section-title"
      data-aos="fade-up"
    >
      <h2>{title}</h2>
    </motion.div>
  );
};

// Carousel component with animation
const AnimatedCarousel = ({ children }) => {
  const [ref, inView] = useInView({});

  return (
    <motion.div
      ref={ref}
      variants={boxVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

export default () => {
  return (
    <section id="why-us" className="why-us">
      <div className="container" data-aos="fade-up">
        <AnimatedTitle title="Por Qué Elegirnos" />
        <AnimatedCarousel>
          <div className="row" data-aos="fade-up" data-aos-delay="200">
            <div className="col-xl-5 img-bg" style={{ backgroundImage: `url(${image})` }}></div>
            <div className="col-xl-7 slides">
              <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 4000, disableOnInteraction: false }}
              >
                <SwiperSlide>
                  <div className="whyUsItem">
                    <h3 className="mb-3">Compromiso con la Excelencia</h3>
                    <h4 className="mb-3">Garantía de satisfacción y atención personalizada.</h4>
                    <p>
                      Nuestra dedicación a la excelencia y la calidad en cada trabajo nos distingue. Brindamos soluciones efectivas y duraderas, asegurando la máxima satisfacción y atención personalizada para cada uno de nuestros clientes.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="whyUsItem">
                    <h3 className="mb-3">Innovación y Tecnología</h3>
                    <h4 className="mb-3">Adoptamos las últimas tecnologías para ofrecer los mejores resultados.</h4>
                    <p>
                      Estamos en constante actualización, incorporando las últimas innovaciones y tecnologías en nuestros proyectos. Esto nos permite ofrecer soluciones más eficientes, seguras y económicas, adaptándonos a las necesidades específicas de cada cliente.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="whyUsItem">
                    <h3 className="mb-3">Experiencia Comprobada</h3>
                    <h4 className="mb-3">Años de servicio confiable en el mercado.</h4>
                    <p>
                      Nuestra larga trayectoria nos avala como expertos en el campo, con un historial probado de proyectos exitosos y clientes satisfechos.
                    </p>
                  </div>
                </SwiperSlide>
                <SwiperSlide>
                  <div className="whyUsItem">
                    <h3 className="mb-3">Servicio Integral</h3>
                    <h4 className="mb-3">Desde la consulta inicial hasta la finalización del proyecto.</h4>
                    <p>
                      Ofrecemos un servicio completo que cubre todas las fases del proyecto, asegurando una ejecución sin fisuras y a la medida de tus necesidades.
                    </p>
                  </div>
                </SwiperSlide>
              </Swiper>
            </div>
          </div>
        </AnimatedCarousel>
      </div>
    </section>
  );
};
