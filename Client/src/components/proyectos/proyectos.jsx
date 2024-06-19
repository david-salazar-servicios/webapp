import React, { useState, useCallback } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import '../../vendor/bootstrap/css/proyectos.css';

import Fontanería_1 from '../../assets/images/Proyectos/Fontanería_1.jpg';
import Fontanería_2 from '../../assets/images/Proyectos/Fontanería_2.jpg';
import Fugas_1 from '../../assets/images/Proyectos/Fugas_1.jpg';
import Fugas_2 from '../../assets/images/Proyectos/Fugas_2.jpg';
import Riego_1 from '../../assets/images/Proyectos/Riego_1.jpg';
import Riego_2 from '../../assets/images/Proyectos/Riego_2.jpg';

const images = [
    [
        {
            src: Fontanería_1,
            alt: 'Trabajos de Fontanería',
            className: 'w-100 shadow-1-strong rounded mb-4 img-hover-effect',
        },
        {
            src: Fugas_1,
            alt: 'Detección de Fugas',
            className: 'w-100 shadow-1-strong rounded mb-4 img-hover-effect',
        },
    ],
    [
        {
            src: Riego_1,
            alt: 'Sistema de Riego',
            className: 'w-100 shadow-1-strong rounded mb-4 img-hover-effect',
        },
        {
            src: Fontanería_2,
            alt: 'Instalación de Tuberías',
            className: 'w-100 shadow-1-strong rounded mb-4 img-hover-effect',
        },
    ],
    [
        {
            src: Fugas_2,
            alt: 'Equipo de Detección de Fugas',
            className: 'w-100 shadow-1-strong rounded mb-4 img-hover-effect',
        },
        {
            src: Riego_2,
            alt: 'Sistema de Riego Automático',
            className: 'w-100 shadow-1-strong rounded mb-4 img-hover-effect',
        },
    ],
];

const Proyectos = React.memo(() => {
    const boxVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    const [show, setShow] = useState(false);
    const [currentImage, setCurrentImage] = useState({ src: '', alt: '' });

    const handleClose = useCallback(() => setShow(false), []);
    const handleShow = useCallback((image) => {
        setCurrentImage(image);
        setShow(true);
    }, []);

    return (
        <>
            <motion.div initial="hidden" animate="visible" variants={boxVariants}>
                <section className="experiance-section">
                    <div className="content-column col-lg-7 col-md-12 col-sm-12">
                        <div className="title-box">
                            <h2>Galería de Proyectos</h2>
                        </div>
                    </div>
                    <div className="row">
                        {images.map((column, colIndex) => (
                            <div className={`col-lg-4 col-md-12 mb-4 mb-lg-0`} key={colIndex}>
                                {column.map((image, imgIndex) => (
                                    <LazyLoadImage
                                        key={imgIndex}
                                        src={image.src}
                                        className={image.className}
                                        alt={image.alt}
                                        onClick={() => handleShow(image)}
                                        effect="blur"
                                        style={{ cursor: 'pointer' }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>
                </section>
            </motion.div>

            <Modal
                show={show}
                onHide={handleClose}
                dialogClassName="custom-modal"
                backdropClassName="custom-modal-backdrop"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{currentImage.alt}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <img
                        src={currentImage.src}
                        alt={currentImage.alt}
                        className="w-100"
                    />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
});

export default Proyectos;
