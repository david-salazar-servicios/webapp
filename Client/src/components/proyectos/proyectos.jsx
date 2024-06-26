import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Gallery, Item } from 'react-photoswipe-gallery';
import 'photoswipe/dist/photoswipe.css';
import '../../vendor/bootstrap/css/proyectos.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import Fontanería_1_600x600 from '../../assets/images/Proyectos/Fontanería_1_600x600.jpg';
import Fontanería_1_1200x1200 from '../../assets/images/Proyectos/Fontanería_1_1200x1200.jpg';
import Fontanería_2_600x600 from '../../assets/images/Proyectos/Fontanería_2_600x600.jpg';
import Fontanería_2_1200x1200 from '../../assets/images/Proyectos/Fontanería_2_1200x1200.jpg';
import Fugas_1_600x600 from '../../assets/images/Proyectos/Fugas_1_600x600.jpg';
import Fugas_1_1200x1200 from '../../assets/images/Proyectos/Fugas_1_1200x1200.jpg';
import Fugas_2_600x600 from '../../assets/images/Proyectos/Fugas_2_600x600.jpg';
import Fugas_2_1200x1200 from '../../assets/images/Proyectos/Fugas_2_1200x1200.jpg';
import Riego_1_600x600 from '../../assets/images/Proyectos/Riego_1_600x600.jpg';
import Riego_1_1200x1200 from '../../assets/images/Proyectos/Riego_1_1200x1200.jpg';
import Riego_2_600x600 from '../../assets/images/Proyectos/Riego_2_600x600.jpg';
import Riego_2_1200x1200 from '../../assets/images/Proyectos/Riego_2_1200x1200.jpg';

AOS.init();

const Proyectos = () => {
    useEffect(() => {
        const handleTouchStart = (e) => {
            const thumb = e.target.closest('.item-folio__thumb');
            if (thumb) {
                thumb.classList.add('touch-active');
            }
        };

        const handleTouchEnd = (e) => {
            const thumb = e.target.closest('.item-folio__thumb');
            if (thumb) {
                thumb.classList.remove('touch-active');
            }
        };

        document.addEventListener('touchstart', handleTouchStart);
        document.addEventListener('touchend', handleTouchEnd);

        return () => {
            document.removeEventListener('touchstart', handleTouchStart);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    const boxVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0 },
        fromLeftToCenter: { opacity: 1, x: [-300, 0] },
    };

    const images = [
        {
            original: Fontanería_1_600x600,
            thumbnail: Fontanería_1_600x600,
            srcSet: `${Fontanería_1_600x600} 1x, ${Fontanería_1_1200x1200} 2x`,
            title: "Fontanería_1",
            text: "Fontanería #1",
            cat: "Heredia, Belén"
        },
        {
            original: Fontanería_2_600x600,
            thumbnail: Fontanería_2_600x600,
            srcSet: `${Fontanería_2_600x600} 1x, ${Fontanería_2_1200x1200} 2x`,
            title: "Fontanería_2",
            text: "Fontanería #2",
            cat: "Heredia, Belén"
        },
        {
            original: Fugas_1_600x600,
            thumbnail: Fugas_1_600x600,
            srcSet: `${Fugas_1_600x600} 1x, ${Fugas_1_1200x1200} 2x`,
            title: "Fugas_1",
            text: "Fugas #1",
            cat: "Alajuela, San Rafael"
        },
        {
            original: Fugas_2_600x600,
            thumbnail: Fugas_2_600x600,
            srcSet: `${Fugas_2_600x600} 1x, ${Fugas_2_1200x1200} 2x`,
            title: "Fugas_2",
            text: "Fugas #2",
            cat: "Alajuela, San Rafael"
        },
        {
            original: Riego_1_600x600,
            thumbnail: Riego_1_600x600,
            srcSet: `${Riego_1_600x600} 1x, ${Riego_1_1200x1200} 2x`,
            title: "Riego_1",
            text: "Riego #1",
            cat: "San José, Santa Ana"
        },
        {
            original: Riego_2_600x600,
            thumbnail: Riego_2_600x600,
            srcSet: `${Riego_2_600x600} 1x, ${Riego_2_1200x1200} 2x`,
            title: "Riego_2",
            text: "Riego #2",
            cat: "San José, Santa Ana"
        }
    ];

    return (
        <motion.div initial="hidden" animate="visible" variants={boxVariants}>
            <section id='works' className="s-works">
                <div className="title-box">
                    <h2>Galería de Proyectos</h2>
                </div>
                <div className="rows works-content">
                    <div className="masonry-wrap">
                        <div className="masonry">
                            <Gallery>
                                {images.map((item, index) => (
                                    <div className="masonry__brick" data-aos="fade" data-aos-easing="ease-in-out" key={index}>
                                        <div className="item-folio">
                                            <div className="item-folio__thumb">
                                                <Item
                                                    original={item.original}
                                                    thumbnail={item.thumbnail}
                                                    width="1050"
                                                    height="700"
                                                    title={item.title}
                                                >
                                                    {({ ref, open }) => (
                                                        <a ref={ref} onClick={open} className="thumb-link" title={item.title}>
                                                            <img src={item.thumbnail} srcSet={item.srcSet} alt={item.title} />
                                                        </a>
                                                    )}
                                                </Item>
                                            </div>
                                            <div className="item-folio__text">
                                                <h3 className="item-folio__title">{item.text}</h3>
                                                <p className="item-folio__cat">{item.cat}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </Gallery>
                        </div>
                    </div>
                </div>
            </section>
        </motion.div>
    );
};

export default Proyectos;
