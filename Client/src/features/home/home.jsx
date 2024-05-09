import React, { useEffect } from 'react';
import useAuth from "../../hooks/useAuth";
import CarouselHeader from '../../components/home/CarouselHeader';
import CardServices from '../../components/services/CardServices';
import experienceImage from '../../assets/images/Logo-removebg-preview.png'
import WhyUs from '../../components/WhyUs';
export default function Home() {

  const auth = useAuth() || {}; // Provide a default value for useAuth in case it's undefined
  const { username = null } = auth; // Destructure username with a default value to prevent TypeError

  return (
    <div>

      {/*
  <section id="icon-boxes" className="icon-boxes">
    <div className="container">

      <div className="row" style={{ margin: "0" }}>
  
        <div className="col-md-6 col-lg-4 d-flex align-items-stretch mb-5 mb-lg-0" data-aos="fade-up">
          <div className="icon-box">
            <div className="icon"></div>
            <h4 className="title"><a href="">Misión</a></h4>
            <p className="description">Proporcionar servicios de fontanería eficientes y confiables, asegurando la satisfacción de nuestros clientes a través de soluciones innovadoras y un trabajo de calidad.</p>
          </div>
        </div>


        <div className="col-md-6 col-lg-4 d-flex align-items-stretch mb-5 mb-lg-0" data-aos="fade-up" data-aos-delay="100">
          <div className="icon-box">
            <div className="icon"></div>
            <h4 className="title"><a href="">Visión</a></h4>
            <p className="description">Ser líderes en el sector de la fontanería, reconocidos por nuestra integridad, calidad de servicio y compromiso con el medio ambiente.</p>
          </div>
        </div>

  
        <div className="col-md-6 col-lg-4 d-flex align-items-stretch mb-5 mb-lg-0" data-aos="fade-up" data-aos-delay="200">
          <div className="icon-box">
            <div className="icon"></div>
            <h4 className="title"><a href="">Objetivos</a></h4>
            <p className="description">Incrementar la satisfacción del cliente, expandir nuestra gama de servicios y promover prácticas sostenibles en todos nuestros proyectos.</p>
          </div>
        </div>

      </div>

    </div>
  </section>
*/}
      <section className="experiance-section">

        <div className="auto-container">
          <div className="row clearfix">

            <div className="title-column col-lg-5 col-md-12 col-sm-12">
              <div className="inner-column">
                <div className="image">
                  <img src={experienceImage} alt="" />
                </div>
                <h2>Compromiso y Calidad <br /> Garantizada</h2>
                <div className="text">Soluciones de confianza para cada necesidad.</div>
              </div>
            </div>

            <div className="content-column col-lg-7 col-md-12 col-sm-12">
              <div className="inner-column">
                <div className="title-box">
                  <h2>Profesionalismo en Fontanería</h2>
                  <p>Con décadas de experiencia, nuestra empresa se ha consolidado como líder en el sector de la fontanería, ofreciendo servicios fiables y de calidad a nuestros clientes.</p>
                  <p>Nos dedicamos a asegurar la completa satisfacción de nuestros clientes a través de un trabajo seguro, eficiente y con garantía de durabilidad.</p>
                </div>
                <div className="specialization-box">
                  <h2>Lo que nos Distingue</h2>

                  <div className="specialise-box">
                    <div className="inner-box">
                      <div className="content">
                        <div className="icon trust-icon"></div>
                        <h5>Confianza y Transparencia</h5>
                        <p>La base de nuestro éxito reside en la confianza y transparencia con nuestros clientes, asegurando una comunicación clara y honesta desde el inicio.</p>
                      </div>
                    </div>
                  </div>

                  <div className="specialise-box">
                    <div className="inner-box">
                      <div className="content">
                        <div className="icon protect-icon"></div>
                        <h5>Seguridad en Cada Proyecto</h5>
                        <p>Implementamos rigurosas medidas de seguridad en cada proyecto, protegiendo tanto a nuestro equipo como a nuestros clientes y sus propiedades.</p>
                      </div>
                    </div>
                  </div>

                  <div className="specialise-box">
                    <div className="inner-box">
                      <div className="content">
                        <div className="icon handshake-icon"></div>
                        <h5>Compromiso con la Calidad</h5>
                        <p>Nuestro compromiso con la calidad es inquebrantable, desde la selección de materiales hasta la ejecución y finalización de cada servicio.</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
      <CardServices />
      <WhyUs />
    </div>
  );
}
