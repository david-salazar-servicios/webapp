import React, { useState, useEffect } from 'react';
import { useGetServicesQuery, useGetAlbumsMutation } from '../../features/services/ServicesApiSlice';
import { Galleria } from 'primereact/galleria';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

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
          thumbnailImageSrc: album.data.images[0].link,
          alt: service.nombre,
          title: service.nombre
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

  const responsiveOptions = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '960px',
      numVisible: 4
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.toString()}</div>;
  if (!response || !response.servicios) return <div>No data available</div>;

  const itemTemplate = (item) => {
    return <img src={item.itemImageSrc} alt={item.alt} style={{ width: '100%', display: 'block' }} />;
  };

  const thumbnailTemplate = (item) => {
    return <img src={item.thumbnailImageSrc} alt={item.alt} style={{ display: 'block' }} />;
  };

  return (
    <div>
      <Galleria value={images} responsiveOptions={responsiveOptions} numVisible={7} circular style={{ maxWidth: '800px' }}
        item={itemTemplate} thumbnail={thumbnailTemplate} />
    </div>
  );
}
