import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../vendor/bootstrap/css/proyectos.css';

const images = [
    [
        {
            src: 'https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp',
            alt: 'Boat on Calm Water',
            className: 'w-100 shadow-1-strong rounded mb-4 img-hover-effect',
        },
        {
            src: 'https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain1.webp',
            alt: 'Wintry Mountain Landscape',
            className: 'w-100 shadow-1-strong rounded mb-4 img-hover-effect',
        },
    ],
    [
        {
            src: 'https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain2.webp',
            alt: 'Mountains in the Clouds',
            className: 'w-100 shadow-1-strong rounded mb-4 img-hover-effect',
        },
        {
            src: 'https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(73).webp',
            alt: 'Boat on Calm Water',
            className: 'w-100 shadow-1-strong rounded mb-4 img-hover-effect',
        },
    ],
    [
        {
            src: 'https://mdbcdn.b-cdn.net/img/Photos/Horizontal/Nature/4-col/img%20(18).webp',
            alt: 'Waves at Sea',
            className: 'w-100 shadow-1-strong rounded mb-4 img-hover-effect',
        },
        {
            src: 'https://mdbcdn.b-cdn.net/img/Photos/Vertical/mountain3.webp',
            alt: 'Yosemite National Park',
            className: 'w-100 shadow-1-strong rounded mb-4 img-hover-effect',
        },
    ],
];

const Proyectos = () => {
    // Define the animation variants
    const boxVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    const [show, setShow] = useState(false);
    const [currentImage, setCurrentImage] = useState({ src: '', alt: '' });

    const handleClose = () => setShow(false);
    const handleShow = (image) => {
        setCurrentImage(image);
        setShow(true);
    };
    return (
        <> <motion.div initial="hidden" animate="visible" variants={boxVariants}>
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
                                <img
                                    key={imgIndex}
                                    src={image.src}
                                    className={image.className}
                                    alt={image.alt}
                                    onClick={() => handleShow(image)}
                                    style={{ cursor: 'pointer' }}
                                />
                            ))}
                        </div>
                    ))}

                    <Modal show={show} onHide={handleClose}>
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
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </section>
        </motion.div>
        </>
    );
};

export default Proyectos;

