import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../../vendor/bootstrap/css/proyectos.css';

// Import optimized images
import Fontanería_1 from '../../assets/images/Proyectos/Fontanería_1.webp';
import Fontanería_2 from '../../assets/images/Proyectos/Fontanería_2.webp';
import Fugas_1 from '../../assets/images/Proyectos/Fugas_1.webp';
import Fugas_2 from '../../assets/images/Proyectos/Fugas_2.webp';
import Riego_1 from '../../assets/images/Proyectos/Riego_1.webp';
import Riego_2 from '../../assets/images/Proyectos/Riego_2.webp';

// Throttle function to limit the frequency of function execution
function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function (...args) {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
}

const LazyLoadImage = lazy(() => import('react-lazy-load-image-component').then(module => ({ default: module.LazyLoadImage })));

const Proyectos = React.memo(() => {
    const images = useMemo(() => [
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
    ], []);

    const boxVariants = useMemo(() => ({
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    }), []);

    const [show, setShow] = useState(false);
    const [currentImage, setCurrentImage] = useState({ src: '', alt: '' });

    const handleClose = useCallback(() => setShow(false), []);
    const handleShow = useCallback(throttle((image) => {
        setCurrentImage(image);
        setShow(true);
    }, 200), []);

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
                                    <div key={imgIndex} style={{ position: 'relative' }}>
                                        <Suspense fallback={<Skeleton height={200} />}>
                                            <LazyLoadImage
                                                src={image.src}
                                                className={image.className}
                                                alt={image.alt}
                                                onClick={() => handleShow(image)}
                                                effect="blur"
                                                style={{ cursor: 'pointer' }}
                                                placeholderSrc={image.src.replace('.webp', '_lowres.webp')}
                                            />
                                        </Suspense>
                                    </div>
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
                        Regresar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
});

export default Proyectos;
