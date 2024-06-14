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
                    {/* Header Section */}
                    <section className="py-5" id="scroll-target">
                        <div className="container px-5 my-5">
                            <div className="row gx-5 align-items-center">
                                <div className="col-lg-6">
                                    <h2 className="fw-bolder">Nuestra Historia</h2>
                                    <p className="lead fw-normal text-muted mb-0" >
                                        En 2009, Don David Salazar fundó Servicios Residenciales y Comerciales CR LTDA para ofrecer sistemas de riego eficientes. Al notar que muchas empresas priorizaban las ventas sobre la conservación del agua, decidió enfocarse en soluciones sostenibles.<br /><br />
                                        Diseñamos proyectos para optimizar el uso del agua, reduciendo el consumo y los costos. Con el tiempo, ampliamos nuestros servicios para diversas necesidades.<br /><br />
                                        Hoy, ofrecemos más de 15 servicios, comprometidos con la calidad, innovación y sostenibilidad, asegurando un manejo responsable del agua y contribuyendo al bienestar del planeta.
                                    </p>
                                </div>
                                <div className="col-lg-6">
                                    <img className="img-fluid rounded mb-5 mb-lg-0" src={historia} alt="..." />
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="py-5">
                        <div className="container px-5 my-5">
                            <div className="row gx-5 align-items-center">
                                <div className="col-lg-6">
                                    <h2 className="fw-bolder">Misión</h2>
                                    <p className="lead fw-normal text-muted mb-0">
                                        Nuestra misión es optimizar el uso del agua con soluciones sostenibles. Atendemos emergencias residenciales y comerciales, usando tecnologías avanzadas y prácticas responsables para conservar el recurso y promover el bienestar comunitario.
                                    </p>
                                </div>
                                <div className="col-lg-6">
                                    <h2 className="fw-bolder">Visión</h2>
                                    <p className="lead fw-normal text-muted mb-0">
                                        Nuestra visión es maximizar el aprovechamiento de los recursos naturales con soluciones hídricas eficientes y sostenibles. Aspiramos a liderar en el uso responsable del agua, resolviendo problemas y garantizando un futuro donde la eficiencia y la sostenibilidad sean la norma en cada hogar y negocio que servimos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Team Members Section */}
                    <section className="py-5 bg-light">
                        <div className="container px-5 my-5">
                            <div className="text-center">
                                <h2 className="fw-bolder">Fundadores</h2>
                                <p className="lead fw-normal text-muted mb-5"></p>
                            </div>
                            <div className="row gx-5 row-cols-1 row-cols-sm-2 row-cols-xl-3 justify-content-center">
                                <div className="col mb-5 mb-5 mb-xl-0">
                                    <div className="text-center">
                                        <img className="img-fluid rounded-circle mb-4 px-4" src={David} alt="..." />
                                        <h5 className="fw-bolder">Full Name</h5>
                                        <div className="fst-italic text-muted">DESIGNATION</div>
                                    </div>
                                </div>
                                <div className="col mb-5 mb-5 mb-xl-0">
                                    <div className="text-center">
                                        <img className="img-fluid rounded-circle mb-4 px-4" src={David} alt="..." />
                                        <h5 className="fw-bolder">Full Name</h5>
                                        <div className="fst-italic text-muted">DESIGNATION</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Testimonials */}
                    <Testimonials />
                </main>
            </div>
        </motion.div>
    );
};

export default AboutUs;
