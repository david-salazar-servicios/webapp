import React, { useState, useEffect } from 'react';
import { useGetServicesQuery, useGetAlbumsMutation } from '../../features/services/ServicesApiSlice';
import { motion, useAnimation, useTime, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { NavLink } from 'react-router-dom';

export default function CardServices() {
  const { data: response, isLoading, isError, error } = useGetServicesQuery();
  const [getAllAlbums] = useGetAlbumsMutation();
  const [images, setImages] = useState([]);

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    fromRightToCenter: { opacity: 1, x: [300, 0] },
  };

  const time = useTime();
  const rotate = useTransform(time, [0, 4000], [0, 360], { clamp: false });

  // Title component with animation
  const AnimatedTitle = ({ title }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView();

    useEffect(() => {
      if (inView) {
        controls.start("visible");
      }
    }, [controls, inView]);

    return (
      <motion.div
        ref={ref}
        animate={controls}
        initial="hidden"
        variants={textVariants}
        transition={{ duration: 0.5 }}
        className="section-title"
        data-aos="fade-up"
      >
        <h2>{title}</h2>
      </motion.div>
    );
  };

  const saveAlbumsToLocalStorage = (albums) => {
    localStorage.setItem('albums', JSON.stringify(albums));
  };

  const getAlbumsFromLocalStorage = () => {
    const albums = localStorage.getItem('albums');
    return albums ? JSON.parse(albums) : null;
  };

  const validateAlbums = (services, albums) => {
    return services.every(service => albums.some(album => album.data.id === service.album));
  };

  const fetchAndSaveAlbums = async (services) => {
    try {
      const albumsResponse = await getAllAlbums(services).unwrap();
      saveAlbumsToLocalStorage(albumsResponse);
      const images = getServiceImages(services, albumsResponse);
      setImages(images);
    } catch (err) {
      console.error('Error fetching albums:', err);
    }
  };

  const getServiceImages = (services, albums) => {
    return services.map(service => {
      const album = albums.find(album => album.data.id === service.album);
      if (album && album.data.images.length > 0) {
        return {
          itemImageSrc: album.data.images[0].link,
          alt: service.nombre,
          title: service.nombre,
          description: service.descripcion,
          id: service.id_servicio
        };
      }
      return null;
    }).filter(image => image !== null);
  };

  useEffect(() => {
    if (response && response.servicios) {
      const storedAlbums = getAlbumsFromLocalStorage();
      if (!storedAlbums || !validateAlbums(response.servicios, storedAlbums)) {
        fetchAndSaveAlbums(response.servicios);
      } else {
        const images = getServiceImages(response.servicios, storedAlbums);
        setImages(images);
      }
    }
  }, [response]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.toString()}</div>;
  if (!response || !response.servicios) return <div>No data available</div>;

  return (
    <>
      <AnimatedTitle title="SERVICIOS" />

      <div className="carousel-container">
        <div id="carouselExampleCaptions" data-bs-interval="2000" data-bs-ride="carousel" className="carousel slide carousel-fade">
          <div className="carousel-indicators">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                data-bs-target="#carouselExampleCaptions"
                data-bs-slide-to={index}
                className={index === 0 ? "active" : ""}
                aria-current={index === 0 ? "true" : "false"}
                aria-label={`Slide ${index + 1}`}
              ></button>
            ))}
          </div>
          <div className="carousel-inner">
            {images.map((image, index) => (
              <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                <img src={image.itemImageSrc} className="carousel-image" alt={image.alt} />
                <div className="carousel-caption">
                  <h5>{image.title}</h5>

                    <NavLink to={`/Services/${image.id}`} className="filled-button mb-5">
                      Leer más
                    </NavLink>

                </div>
              </div>
            ))}
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </>
  );
}
