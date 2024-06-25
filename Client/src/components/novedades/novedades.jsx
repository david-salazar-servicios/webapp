import React, { useState } from 'react';
import '../../vendor/bootstrap/css/novedades.css'; 
import 'aos/dist/aos.css'; 

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

  const nextProfile = () => {
    setCurrentPage((prevPage) => (prevPage + 1) % profiles.length);
  };

  const prevProfile = () => {
    setCurrentPage((prevPage) => (prevPage - 1 + profiles.length) % profiles.length);
  };

  return (
    <div className="container-news">
      <iframe
        src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(profiles[currentPage])}&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId&locale=es_ES`}
        width="340"
        height="500"
        style={{ border: 'none', overflow: 'hidden' }}
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
      </iframe>
      <ul className="pagination">
        <li>
          <button onClick={prevProfile} disabled={currentPage === 0}>Prev</button>
        </li>
        {profiles.map((_, index) => (
          <li key={index} className={index === currentPage ? 'active' : ''}>
            <button onClick={() => setCurrentPage(index)}>{index + 1}</button>
          </li>
        ))}
        <li>
          <button onClick={nextProfile} disabled={currentPage === profiles.length - 1}>Next</button>
        </li>
      </ul>
    </div>
  );
};

export default Novedades;