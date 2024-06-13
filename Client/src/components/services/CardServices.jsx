import React, { useState, useEffect } from 'react';
import { useGetServicesQuery, useGetAlbumsMutation } from '../../features/services/ServicesApiSlice';
import { motion } from 'framer-motion';
import 'bootstrap/dist/css/bootstrap.min.css';

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
          // itemImageSrc: album.data.images[0].link, // Remove image URL
          alt: service.nombre,
          title: service.nombre,
          description: service.descripcion
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
    <div className="container">
      <div className="row">
        {images.map((image, index) => (
          <div className="col-md-6" key={index}>
            <motion.div
              className="product-card"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{ marginBottom: '20px' }} // Add space between cards
            >
              <div className="product-info">
                <h1 className="product-title">{image.title}</h1>
                <p className="product-description">{image.description}</p>
                <button className="learn-more-button">Conoce más</button>
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
}
