import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Row, Col } from 'antd';

// Import your images
import Fontanería_1_600x600 from '../../assets/images/Proyectos/Fontanería_1_600x600.jpg';
import Fontanería_1_1200x1200 from '../../assets/images/Proyectos/Fontanería_1_1200x1200.jpg';
import Fontanería_2_600x600 from '../../assets/images/Proyectos/Fontanería_2_600x600.jpg';
import Fontanería_2_1200x1200 from '../../assets/images/Proyectos/Fontanería_2_1200x1200.jpg';
import Fugas_1_600x600 from '../../assets/images/Proyectos/Fugas_1_600x600.jpg';
import Fugas_1_1200x1200 from '../../assets/images/Proyectos/Fugas_1_1200x1200.jpg';

AOS.init();

const Proyectos = () => {
    useEffect(() => {
        AOS.init({ duration: 1000 });
    }, []);

    const images = [
        { src: Fontanería_1_600x600, large: Fontanería_1_1200x1200, alt: "Fontanería #1", location: "Heredia, Belén" },
        { src: Fontanería_2_600x600, large: Fontanería_2_1200x1200, alt: "Fontanería #2", location: "Heredia, Belén" },
        { src: Fugas_1_600x600, large: Fugas_1_1200x1200, alt: "Fugas #1", location: "Alajuela, San Rafael" },
        { src: Fontanería_2_600x600, large: Fontanería_2_1200x1200, alt: "Fontanería #2 Duplicate", location: "Heredia, Belén" },
        { src: Fontanería_1_600x600, large: Fontanería_1_1200x1200, alt: "Fontanería #1 Duplicate", location: "Heredia, Belén" },
        { src: Fugas_1_600x600, large: Fugas_1_1200x1200, alt: "Fugas #1 Duplicate", location: "Alajuela, San Rafael" },
    ];

    return (
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <section id='works' className="s-works">
                <div className="title-box">
                    <h2 className="h2-title">Galería de Proyectos</h2>
                </div>

                <Gallery>
                    <Row gutter={[16, 16]} justify="center">
                        {images.map((image, index) => (
                            <Col xs={24} sm={12} lg={8} key={index} data-aos="fade-up">
                                <div className="item-folio">
                                    <div className="item-folio__thumb">
                                        <Item original={image.large} thumbnail={image.src} width="1200" height="800" title={image.alt}>
                                            {({ ref, open }) => (
                                                <a ref={ref} onClick={open} className="thumb-link" title={image.alt}>
                                                    <img
                                                        src={image.src}
                                                        alt={image.alt}
                                                        className="img-gallery w-100 shadow-1-strong rounded"
                                                        style={{ cursor: 'pointer', borderRadius: '8px' }}
                                                    />
                                                </a>
                                            )}
                                        </Item>
                                    </div>
                                    <div className="item-folio__text">
                                        <h3 className="item-folio__title">{image.alt}</h3>
                                        <p className="item-folio__cat">{image.location}</p>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Gallery>
            </section>
        </motion.div>
    );
};

export default Proyectos;
