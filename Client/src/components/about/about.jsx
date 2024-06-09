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
                                    <p className="lead fw-normal text-muted mb-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto est, ut esse a labore aliquam beatae expedita. Blanditiis impedit numquam libero molestiae et fugit cupiditate, quibusdam expedita, maiores eaque quisquam.</p>
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
                                    <h2 className="fw-bolder">Misión, Visión y Valores</h2>
                                    <p className="lead fw-normal text-muted mb-0">Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto est, ut esse a labore aliquam beatae expedita. Blanditiis impedit numquam libero molestiae et fugit cupiditate, quibusdam expedita, maiores eaque quisquam.</p>
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
