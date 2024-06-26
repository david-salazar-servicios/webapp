import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import useAuth from "../../hooks/useAuth";
import CarouselHeader from '../../components/home/CarouselHeader';
import CardServices from '../../components/services/CardServices';
import experienceImage from '../../assets/images/Logo-removebg-preview.png';
import WhyUs from '../../components/WhyUs';

export default function Home() {
  const auth = useAuth() || {}; // Provide a default value for useAuth in case it's undefined
  const { username = null } = auth; // Destructure username with a default value to prevent TypeError

  // Define the animation variants
  const boxVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    fromLeftToCenter: { opacity: 1, x: [-300, 0] }, // Move from left to center
  };

  const textVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    fromRightToCenter: { opacity: 1, x: [300, 0] }, // Move from right to center
  };

  // Create a component for each specialization box to reuse the animation logic
  const SpecializationBox = ({ delay, iconClass, title, text }) => {
    const [ref, inView] = useInView({});

    return (
      <motion.div
        ref={ref}
        className="specialise-box"
        variants={boxVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ duration: 0.5, delay }}
      >
        <div className="inner-box">
          <div className="content">
            <div className={`icon ${iconClass}`}></div>
            <h5>{title}</h5>
            <p>{text}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const Logo = () => {
    const [ref, inView] = useInView({});

    return (
      <motion.div
        ref={ref}
        variants={boxVariants}
        initial="hidden"
        animate={inView ? "fromLeftToCenter" : "hidden"} // Use the new variant
        transition={{ duration: 0.8 }}
        className="logo"
      >
        <div className="image">
          <img src={experienceImage} alt="Logo" />
        </div>
      </motion.div>
    );
  };


  const Logobox = () => {
    return (
      <div className="inner-column">
        <Logo />
        <div
          className="logo-text"
        >
          <h2>Compromiso y Calidad <br /> Garantizada</h2>
          <div className="text fst-italic">Soluciones de confianza para cada necesidad.</div>
        </div>
      </div>
    );
  };



  return (
    <motion.div initial="hidden" animate="visible" variants={boxVariants}>
      <section className="experiance-section">
        <div className="auto-container">
          <div className="row clearfix">
            <div className="title-column col-lg-5 col-md-12 col-sm-12">
              <Logobox />
            </div>
            <div className="content-column col-lg-7 col-md-12 col-sm-12">
              <div
                className="title-box"
              >
                <h2>Profesionalismo en Fontanería</h2>
              </div>

              <div

                className="description"
              >
                <div className="text">Con décadas de experiencia, nuestra empresa se ha consolidado como líder en el sector de la fontanería, ofreciendo servicios fiables y de calidad a nuestros clientes.<br /><br /></div>
                <div className="text">Nos dedicamos a asegurar la completa satisfacción de nuestros clientes a través de un trabajo seguro, eficiente y con garantía de durabilidad.</div>
              </div>
              <div className="specialization-box">
                <div
                  className="title-box"
                >
                  <h2>Lo que nos Distingue </h2>
                </div>

                <SpecializationBox
                  delay={0}
                  iconClass="trust-icon"
                  title="Confianza y Transparencia"
                  text="La base de nuestro éxito reside en la confianza y transparencia con nuestros clientes, asegurando una comunicación clara y honesta desde el inicio."
                />
                <SpecializationBox
                  delay={0.2}
                  iconClass="protect-icon"
                  title="Seguridad en Cada Proyecto"
                  text="Implementamos rigurosas medidas de seguridad en cada proyecto, protegiendo tanto a nuestro equipo como a nuestros clientes y sus propiedades."
                />
                <SpecializationBox
                  delay={0.4}
                  iconClass="handshake-icon"
                  title="Compromiso con la Calidad"
                  text="Nuestro compromiso con la calidad es inquebrantable, desde la selección de materiales hasta la ejecución y finalización de cada servicio."
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <CardServices />
      <WhyUs />
    </motion.div>
  );
}
