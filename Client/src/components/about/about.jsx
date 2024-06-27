import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Testimonials from '../../components/testimonials/testimonials';

import Empresa from '../../assets/images/empresa.png';
import David from '../../assets/images/David.jpg';
import David2 from '../../assets/images/David2.jpg';

export default function Home() {
    // Define the animation variants
    const boxVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
        fromLeftToCenter: { opacity: 1, x: [-300, 0] }, // Move from left to center
    };
    // Create a component for each specialization box to reuse the animation logic
    const SpecializationBox = ({ delay, iconClass, title, text }) => {
        const [ref, inView] = useInView({});

        return (
            <motion.div
                ref={ref}
                className="specialized-box"
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
    const Pic = ({ src }) => {
        const [ref, inView] = useInView({});
        console.log(src);
        return (
            <motion.div
                ref={ref}
                variants={boxVariants}
                initial="hidden"
                animate={inView ? "fromLeftToCenter" : "hidden"} // Use the new variant
                transition={{ duration: 0.5 }}
                className="logo"
            >
                <div className="image">
                    <img className="img-fluid rounded mb-5 mb-lg-0" src={src} alt="Pic" />
                </div>
            </motion.div>
        );
    };
    const HistoriaPics = () => {
        return (
            <div className="inner-column ">
                <Pic src={Empresa} />
            </div>
        );
    };
    return (
        <motion.div initial="hidden" animate="visible" variants={boxVariants}>
            <section className="experiance-section">
                <div className="auto-container">
                    <div className="row clearfix">
                        <div className="content-column col-lg-7 col-md-12 col-sm-12">
                            <div className="title-box">
                                <h2>Nuestra Historia</h2>
                            </div>
                            <div className="description">
                                En 2009, Don David Salazar fundó Servicios Residenciales y Comerciales CR LTDA para ofrecer sistemas de riego eficientes. Al notar que muchas empresas priorizaban las ventas sobre la conservación del agua, decidió enfocarse en soluciones sostenibles.<br /><br />
                                Diseñamos proyectos para optimizar el uso del agua, reduciendo el consumo y los costos. Con el tiempo, ampliamos nuestros servicios para diversas necesidades.<br /><br />
                                Hoy, ofrecemos más de 15 servicios, comprometidos con la calidad, innovación y sostenibilidad, asegurando un manejo responsable del agua y contribuyendo al bienestar del planeta.
                            </div>

                        </div>
                        <div className="title-column col-lg-5 col-md-12 col-sm-12">
                            <HistoriaPics />
                        </div>
                        <div className="specialization-box">
                            <div className="title-box">
                                <h2>Nuestra Misión y Visión</h2>
                            </div>
                            <SpecializationBox
                                delay={0}
                                iconClass="mission-icon"
                                title="Misión"
                                text="Nuestra misión es optimizar el uso del agua con soluciones sostenibles. Atendemos emergencias residenciales y comerciales, usando tecnologías avanzadas y prácticas responsables para conservar el recurso y promover el bienestar comunitario."
                            />
                            <SpecializationBox
                                delay={0.2}
                                iconClass="vision-icon"
                                title="Visión"
                                text="Nuestra visión es maximizar el aprovechamiento de los recursos naturales con soluciones hídricas eficientes y sostenibles. Aspiramos a liderar en el uso responsable del agua, resolviendo problemas y garantizando un futuro donde la eficiencia y la sostenibilidad sean la norma en cada hogar y negocio que servimos."
                            />
                        </div>
                    </div>
                </div>
                <div className="container px-5 my-5">
                    <div className="text-center">
                        <h2 className="fw-bolder">Fundadores</h2>
                    </div>
                    <div className="row gx-5 row-cols-1 row-cols-sm-2 row-cols-xl-3 justify-content-center">
                        <div className="col mb-5 mb-5 mb-xl-0">
                            <div className="text-center">
                                <img className="img-fluid img-fluid-motion rounded-circle mb-4 px-4" src={David} alt="..." />
                                <h5 className="fw-bolder">David</h5>
                                <div className="fst-italic text-muted">Propietario</div>
                            </div>
                        </div>
                        <div className="col mb-5 mb-5 mb-xl-0">
                            <div className="text-center">
                                <img className="img-fluid img-fluid-motion rounded-circle mb-4 px-4" src={David2} alt="..." />
                                <h5 className="fw-bolder">Mariela</h5>
                                <div className="fst-italic text-muted">Copropietario</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Testimonials />
        </motion.div>
    );
}
