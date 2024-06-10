import React, { useState, useEffect } from 'react';
import { useGetServicesQuery, useGetAlbumsMutation } from '../../features/services/ServicesApiSlice';
import { Card, Button, Row, Col, Typography, Image } from 'antd';
import { RightOutlined } from '@ant-design/icons';

const { Meta } = Card;

const cardStyle = {
  margin: '20px auto', // Center the card horizontally
};

const imgStyle = {
  display: 'block',
  width: '100%',
  objectFit: 'cover', // Ensure the image covers the area
  maxHeight: '200px',
};

const textStyle = {
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
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
          description: service.descripcion // Assuming `descripcion` is a field in the service
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
      <Row gutter={[16, 16]} justify="center">
        <Image.PreviewGroup>
          {images.map((image, index) => (
            <Col key={index} xs={24} sm={12} md={8} lg={6}>
              <Card hoverable style={cardStyle} bodyStyle={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Image alt={image.alt} src={image.itemImageSrc} style={imgStyle} />
                  <div style={textStyle}>
                    <Typography.Title level={4}>{image.title}</Typography.Title>
                    <Typography.Text>{image.description}</Typography.Text>
                    <Button type="primary" href="#">
                      COMPRAR <RightOutlined />
                    </Button>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Image.PreviewGroup>
      </Row>
    </div>
  );
}
