import React, { useEffect } from 'react';
import '../../vendor/bootstrap/css/aboutUs.css';
import { motion } from 'framer-motion';
import historia from '../../assets/images/empresa.png';
import David from '../../assets/images/David.jpg';
import David2 from '../../assets/images/David2.jpg';

const Testimonials = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://www.tiktok.com/embed.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="video-gallery">
            <div className="video-wrapper">
                <iframe
                    src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F1733439073592957%2Fvideos%2F707488043079014%2F&show_text=false&width=560&t=0"
                    width="560"
                    height="314"
                    style={{ border: 'none', overflow: 'hidden' }}
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
            </div>
            <div className="video-wrapper">
                <iframe
                    src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F100011746801863%2Fvideos%2F1394278528188274%2F&show_text=false&width=560&t=0"
                    width="560"
                    height="314"
                    style={{ border: 'none', overflow: 'hidden' }}
                    allowFullScreen
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                ></iframe>
            </div>
            {/*  <div className="video-wrapper">
                <blockquote
                    className="tiktok-embed"
                    cite="https://www.tiktok.com/@davidsalazarcr/video/7229746512471936262"
                    data-video-id="7229746512471936262"
                    style={{ maxWidth: '605px', minWidth: '325px' }}
                >
                    <section>
                        <a
                            target="_blank"
                            title="@davidsalazarcr"
                            href="https://www.tiktok.com/@davidsalazarcr?refer=embed"
                        >
                            @davidsalazarcr
                        </a>
                        <p>
                            ✅Detección y reparación de fugas de agua, filtros, fontanería y
                            más!!! 🇨🇷 Será un gusto atenderles!! ☎️2239 6042 oficina 📱8609
                            6382 WhatsApp oficina
                        </p>
                        <a
                            target="_blank"
                            title="♬ Bad To The Bone - George Thorogood &#38; The Destroyers"
                            href="https://www.tiktok.com/music/Bad-To-The-Bone-7084053584836315137?refer=embed"
                        >
                            ♬ Bad To The Bone - George Thorogood &#38; The Destroyers
                        </a>
                    </section>
                </blockquote>
            </div> */}
        </div>
    );
};

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
                                        {/* <h5 className="fw-bolder">David y Mariela</h5>
                                        <div className="fst-italic text-muted">Founder &amp; CEO</div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    {/* Testimonials */}
                    <section className="py-5">
                        <div className="container px-5 my-5">
                            <div className="text-center">
                                <h2 className="fw-bolder">Testimonios</h2>
                                <p className="lead fw-normal text-muted mb-5">Los testimonios de nuestros clientes destacan la calidad y compromiso de nuestro trabajo. En los videos, expresan su satisfacción por nuestros servicios, desde la reparación de fugas hasta la instalación de sistemas de filtración. Estos testimonios reflejan nuestra profesionalidad y la confianza que hemos construido con nuestros clientes. Cada servicio realizado busca superar sus expectativas, y estos videos son prueba de nuestro éxito en lograrlo.</p>
                            </div>
                            <Testimonials />
                        </div>
                    </section>
                </main>
            </div>
        </motion.div >
    );
};

export default AboutUs;
