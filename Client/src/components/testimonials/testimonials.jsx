import React, { useEffect } from 'react';
import '../../vendor/bootstrap/css/estiloAdicional.css';
import { motion } from 'framer-motion';

const Testimonials = () => {
    // Define the animation variants
    const boxVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 50,
                damping: 10,
                staggerChildren: 0.3, // Ensure child elements are staggered
            },
        },
    };

    const wrapperVariants = {
        hidden: { opacity: 0, y: 1000 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 50, damping: 10 } },
    };

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
        <motion.div initial="hidden" animate="visible" variants={boxVariants}>
            <section className="py-5">
                <div className="container px-5 my-5">
                    <div className="text-center">
                        <h2 className="fw-bolder">Testimonios de Clientes</h2>
                        <p className="lead fw-normal text-muted mb-5">
                            Nuestros clientes destacan la calidad y compromiso de nuestro trabajo. En los videos, expresan satisfacción con servicios como la reparación de fugas e instalación de sistemas de filtración, reflejando nuestra profesionalidad y confianza.
                        </p>
                    </div>
                    <div className="video-gallery">
                        <motion.div className="video-wrapper" variants={wrapperVariants}>
                            <iframe
                                src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F1733439073592957%2Fvideos%2F707488043079014%2F&show_text=false&width=560&t=0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        </motion.div>
                        <motion.div className="video-wrapper" variants={wrapperVariants}>
                            <iframe
                                src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F100011746801863%2Fvideos%2F1394278528188274%2F&show_text=false&width=560&t=0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        </motion.div>
                        <motion.div className="video-wrapper" variants={wrapperVariants}>
                            <iframe
                                src="https://www.facebook.com/plugins/video.php?height=314&href=https%3A%2F%2Fwww.facebook.com%2F100011746801863%2Fvideos%2F3376004669385005%2F&show_text=false&width=560&t=0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        </motion.div>
                        <motion.div className="video-wrapper vertical" variants={wrapperVariants}>
                            <iframe
                                src="https://www.facebook.com/plugins/video.php?height=476&href=https%3A%2F%2Fwww.facebook.com%2F100011746801863%2Fvideos%2F827868275105534%2F&show_text=false&width=267&t=0"
                                allowFullScreen
                                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            ></iframe>
                        </motion.div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default Testimonials;
