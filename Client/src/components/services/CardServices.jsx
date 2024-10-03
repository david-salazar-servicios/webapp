import React, { useState, useEffect } from 'react';
import { useGetServicesQuery, useGetAlbumsMutation } from '../../features/services/ServicesApiSlice';
import { NavLink } from 'react-router-dom';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const ServiceCard = ({ service }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false });
  
  useEffect(() => {
    if (inView) {
      controls.start({
        opacity: 1,
        y: 0,
        transition: { duration: 0.5 },
      });
    } else {
      controls.start({
        opacity: 0,
        y: 50,
      });
    }
  }, [inView, controls]);

  return (
    <motion.div
      ref={ref}
      className='col-12 col-sm-10 col-md-6 col-lg-4' // Adjusted grid classes for better centering
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
    >
      <article className="postcard light blue">
        <img className="postcard__img" src={service.itemImageSrc} alt={service.alt} referrerPolicy="no-referrer" />
        <div className="postcard__text t-dark">
          <h1 className="postcard__title">{service.title}</h1>

          <div className="postcard__bar"></div>
          <div className="postcard__tagbox">
            <ul>
              <li className="tag__item">
                <NavLink to={`/Services/${service.id}`} className="postcard__link">
                  <i className="fas fa-link mr-2"></i>Leer más
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </article>
    </motion.div>
  );
};

export default function CardServices() {
  const { data: response, isLoading, isError, error } = useGetServicesQuery();
  const [getAllAlbums] = useGetAlbumsMutation();
  const [images, setImages] = useState([]);

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

  const sortServices = (services) => {
    const desiredOrder = [
      "Riego automático residencial y comercial",
      "Detección de fugas de agua",
      "Sistema de bombeo",
      "Servicios Integrales de Fontanería",
      "Destaqueo e Inspección de Tuberías de Desagüe",
      "Equipos de filtrado",
      "Limpieza a presión de superficies"
    ];

    return [...services].sort((a, b) => {
      return desiredOrder.indexOf(a.nombre) - desiredOrder.indexOf(b.nombre);
    });
  };

  useEffect(() => {
    if (response && response.servicios) {
      const sortedServices = sortServices(response.servicios);
      const storedAlbums = getAlbumsFromLocalStorage();
      if (!storedAlbums || !validateAlbums(sortedServices, storedAlbums)) {
        fetchAndSaveAlbums(sortedServices);
      } else {
        const images = getServiceImages(sortedServices, storedAlbums);
        setImages(images);
      }
    }
  }, [response]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.toString()}</div>;
  if (!response || !response.servicios) return <div>No data available</div>;

  return (
    <>
      <section className="light">
        <div className="container py-4">
          <div className="section-title text-center">
            <h2>Servicios</h2>
          </div>
          <div className="row justify-content-center">
            {images.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
