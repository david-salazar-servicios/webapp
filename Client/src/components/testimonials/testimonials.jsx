import React, { useEffect } from 'react';
import '../../vendor/bootstrap/css/estiloAdicional.css';
import { motion } from 'framer-motion';

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

    const boxVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={boxVariants}>
            <section className="py-5">
                <div className="container px-5 my-5">
                    <div className="text-center">
                        <h2 className="fw-bolder">Testimonios de Clientes</h2>
                        <p className="lead fw-normal text-muted mb-5">Los testimonios de nuestros clientes destacan la calidad y compromiso de nuestro trabajo. En los videos, expresan su satisfacción por nuestros servicios, desde la reparación de fugas hasta la instalación de sistemas de filtración. Estos testimonios reflejan nuestra profesionalidad y la confianza que hemos construido con nuestros clientes. Cada servicio realizado busca superar sus expectativas, y estos videos son prueba de nuestro éxito en lograrlo.</p>
                    </div>
                    <div className="video-gallery">
                        <div className="video-wrapper">
                            <iframe
                                src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F1733439073592957%2Fvideos%2F707488043079014%2F&show_text=false&width=560&t=0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        </div>
                        <div className="video-wrapper">
                            <iframe
                                src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F100011746801863%2Fvideos%2F1394278528188274%2F&show_text=false&width=560&t=0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        </div>
                        <div className="video-wrapper">
                            <iframe
                                src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F100011746801863%2Fvideos%2F3376004669385005%2F&show_text=false&width=560&t=0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        </div>
                        <div className="video-wrapper vertical">
                            <iframe
                                src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100011746801863%2Fvideos%2F827868275105534%2F&show_text=false&width=267&t=0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default Testimonials;