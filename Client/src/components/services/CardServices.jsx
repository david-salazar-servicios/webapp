import React, { useState, useEffect } from 'react';
import { useGetServicesQuery, useGetAlbumsMutation } from '../../features/services/ServicesApiSlice';

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
          description: service.descripcion.substring(0, 100) // Show a portion of the description
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
    <div id="carouselExampleCaptions" className="carousel slide" data-bs-ride="carousel">
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
            <img src={image.itemImageSrc} className="d-block w-100 carousel-image" alt={image.alt} />
            <div className="carousel-caption d-none d-md-block">
              <h5>{image.title}</h5>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
