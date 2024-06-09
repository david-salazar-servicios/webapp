import React from 'react';
import { motion } from 'framer-motion';
import '../../vendor/bootstrap/css/estiloAdicional.css';

const Proyectos = () => {
    // Define the animation variants
    const boxVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <motion.div initial="hidden" animate="visible" variants={boxVariants}>
            <section className="py-5">
                <div className="container px-5 my-5">
                    <div className="text-center">
                        <h2 className="fw-bolder">Proyectos Recientes</h2>
                        <p className="lead fw-normal text-muted mb-5">...</p>
                    </div>
                </div>
            </section>
        </motion.div >
    );
};

export default Proyectos;
