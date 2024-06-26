import React, { useState } from 'react';
import '../../vendor/bootstrap/css/novedades.css';
import { motion } from 'framer-motion';

const profiles = [
  "https://www.facebook.com/profile.php?id=100037466996673",
  "https://www.facebook.com/profile.php?id=100041823116102",
  "https://www.facebook.com/profile.php?id=100093514793577",
  "https://www.facebook.com/profile.php?id=100062304109587",
  "https://www.facebook.com/profile.php?id=100063553915196",
  "https://www.facebook.com/phcerofugasCR",
  "https://www.facebook.com/fontaneroCR1",
  "https://www.facebook.com/profile.php?id=61550243357875",
  "https://www.facebook.com/profile.php?id=61550671803224",
];

const Novedades = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const changePage = (newPage) => {
    setTransitioning(true);
    setTimeout(() => {
      setCurrentPage(newPage);
      setTransitioning(false);
    }, 500); // Match this duration with the CSS transition duration
  };

  const nextProfile = () => {
    changePage((currentPage + 1) % profiles.length);
  };

  const prevProfile = () => {
    changePage((currentPage - 1 + profiles.length) % profiles.length);
  };

  // Define the animation variants
  const boxVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
    fromLeftToCenter: { opacity: 1, x: [-300, 0] }, // Move from left to center
  };

  return (
    <motion.div initial="hidden" animate="visible" variants={boxVariants}>
      <section className="experiance-section">
        <div className="auto-container">
          <div className="row clearfix">
            <div className="content-column col-lg-7 col-md-12 col-sm-12">
              <div className="title-box">
                <h2>Novedades en nuestras Redes</h2>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="container-news">
        <div className={`fade-enter ${transitioning ? 'fade-exit-active' : 'fade-enter-active'}`}>
          <iframe
            src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(profiles[currentPage])}&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId&locale=es_ES`}
            width="340"
            height="500"
            style={{ border: 'none', overflow: 'hidden' }}
            allowFullScreen={true}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
          </iframe>
        </div>
        <ul className="pagination">
          <li>
            <button onClick={prevProfile} disabled={currentPage === 0}>Ant.</button>
          </li>
          {profiles.map((_, index) => (
            <li key={index} className={index === currentPage ? 'active' : ''}>
              <button onClick={() => changePage(index)}>{index + 1}</button>
            </li>
          ))}
          <li>
            <button onClick={nextProfile} disabled={currentPage === profiles.length - 1}>Sig.</button>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default Novedades;
