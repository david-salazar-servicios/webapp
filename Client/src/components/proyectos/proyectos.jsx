import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Row, Col } from 'antd';

AOS.init();

const Proyectos = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        AOS.init({ duration: 1000 });

        // Load images from localStorage
        const albumsData = JSON.parse(localStorage.getItem('albums')) || [];
        const loadedImages = [];

        // Extract images from each album
        albumsData.forEach(album => {
            const albumImages = album.data.images || [];
            albumImages.forEach(image => {
                loadedImages.push({
                    src: `https://i.imgur.com/${image.id}.jpg`, // Construct the image URL
                    large: `https://i.imgur.com/${image.id}.jpg`,
                    alt: album.data.title || 'Project Image',
                    location: album.data.description || 'Unknown Location'
                });
            });
        });

        setImages(loadedImages);
    }, []);

    return (
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <section id='works' className="s-works">
                <div className="section-title">
                    <h2 className="h2-title">Galería de Proyectos</h2>
                </div>

                <Gallery>
                    <Row gutter={[16, 16]} justify="center">
                        {images.map((image, index) => (
                            <Col xs={24} sm={12} lg={8} key={index} data-aos="fade-up">
                                <div className="project-item">
                                    <Item original={image.large} thumbnail={image.src} width="1200" height="800" title={image.alt}>
                                        {({ ref, open }) => (
                                            <a ref={ref} onClick={open} className="thumb-link" title={image.alt}>
                                                <img
                                                    src={image.src}
                                                    alt={image.alt}
                                                    className="project-img"
                                                    style={{ cursor: 'pointer', borderRadius: '8px' }}
                                                />
                                            </a>
                                        )}
                                    </Item>
                                    <div className="overlay">
                                        <h6 className="overlay-title">{image.alt}</h6>
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
