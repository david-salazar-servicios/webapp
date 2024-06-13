import React from 'react';
import '../../vendor/bootstrap/css/estiloAdicional.css';
import { motion } from 'framer-motion';
import historia from '../../assets/images/empresa.png';
import David from '../../assets/images/David.jpg';
import David2 from '../../assets/images/David2.jpg';
import Testimonials from '../../components/testimonials/testimonials';

const AboutUs = () => {
    // Define the animation variants
    const boxVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={boxVariants}>
            <div className="d-flex flex-column">
                <main className="flex-shrink-0">
                    {/* About section one */}
                    <section className="py-5 bg-light" id="scroll-target">
                        <div className="container px-5 my-5">
                            <div className="row gx-5 align-items-center">
                                <div className="col-lg-6"><img className="img-fluid rounded mb-5 mb-lg-0" src={historia} alt="..." /></div>
                                <div className="col-lg-6">
                                    <h2 className="fw-bolder">Nuestra Historia</h2>
                                    <p className="lead fw-normal text-muted mb-0" >
                                        En 2009, Don David Salazar fundó Servicios Residenciales y Comerciales CR LTDA con el objetivo de ofrecer sistemas de riego eficientes para áreas residenciales y comerciales. Al notar que muchas empresas priorizaban las ventas sobre la conservación del agua, decidió enfocarse en soluciones sostenibles.<br /><br />
                                        Diseñamos proyectos para optimizar el uso del agua, implementando sistemas de riego que reducían el consumo y los costos. Con el tiempo, ampliamos nuestra oferta de servicios para atender diversas necesidades residenciales y comerciales.<br /><br />
                                        Hoy, Servicios Residenciales y Comerciales CR LTDA ofrece más de 15 servicios, manteniendo un firme compromiso con la calidad, la innovación y la sostenibilidad, asegurando un manejo responsable del agua y contribuyendo al bienestar del planeta.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* About section two */}
                    <section className="py-5">
                        <div className="container px-5 my-5">
                            <div className="row gx-5 align-items-center">
                                <div className="col-lg-6 order-first order-lg-last"><img className="img-fluid rounded mb-5 mb-lg-0" src={David2} alt="..." /></div>
                                <div className="col-lg-6">
                                    <h2 className="fw-bolder">Misión y Visión</h2>
                                    <p className="lead fw-normal text-muted mb-0">
                                        Nuestra misión es salvaguardar y optimizar el uso del recurso hídrico en cada proyecto que emprendemos, garantizando soluciones sostenibles y eficientes. Nos dedicamos a atender con prontitud y eficacia las emergencias tanto residenciales como comerciales relacionadas con el agua. Nuestro compromiso incluye resolver complicaciones que los clientes puedan enfrentar con el suministro de agua potable, el manejo de aguas residuales y otros sistemas hídricos. Nos esforzamos por proporcionar un servicio de calidad que asegure la satisfacción y la tranquilidad de nuestros clientes, mediante la implementación de tecnologías avanzadas y prácticas responsables que promuevan la conservación del agua y el bienestar comunitario.<br /><br />
                                        Nuestra visión es trabajar de la mano con los recursos naturales para maximizar su aprovechamiento, promoviendo una economía más eficiente y sostenible para nuestros consumidores. Aspiramos a ser líderes en soluciones hídricas que no sólo resuelvan problemas inmediatos, sino que también fomenten el uso responsable y consciente del agua, garantizando un futuro donde la eficiencia y la sostenibilidad sean la norma en cada hogar y negocio que servimos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Team members section */}
                    <section className="py-5 bg-light">
                        <div className="container px-5 my-5">
                            <div className="text-center">
                                <h2 className="fw-bolder">Fundadores</h2>
                                <p className="lead fw-normal text-muted mb-5">Hola!  Somos David y Mariela, fundadores de Servicios Residenciales &amp; Comerciales CRLTDA.</p>
                            </div>
                            <div className="row gx-5 row-cols-1 row-cols-sm-2 row-cols-xl-4 justify-content-center">
                                <div className="col mb-5 mb-5 mb-xl-0">
                                    <div className="text-center">
                                        <img className="img-fluid rounded-circle mb-4 px-4" src={David} alt="..." />
                                        <h5 className="fw-bolder">Ibbie Eckart</h5>
                                        <div className="fst-italic text-muted">Founder &amp; CEO</div>
                                    </div>
                                </div>
                                <div className="col mb-5 mb-5 mb-xl-0">
                                    <div className="text-center">
                                        <img className="img-fluid rounded-circle mb-4 px-4" src={David} alt="..." />
                                        <h5 className="fw-bolder">Arden Vasek</h5>
                                        <div className="fst-italic text-muted">CFO</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Testimonials */}
                    <Testimonials />
                </main>
            </div>
        </motion.div >
    );
};

export default AboutUs;
