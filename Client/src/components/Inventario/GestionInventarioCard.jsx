import React from 'react';
import { Card, Col, Row } from 'antd';
import PropTypes from 'prop-types'; // For prop types

const GestionInventarioCard = ({ bodegas, handleCardClick }) => {
  return (
    <Row gutter={[16, 16]} justify="center">
      {bodegas.map((bodega) => (
        <Col key={bodega.id} xs={24} sm={12} md={8} lg={6}>
          <Card
            className="bodega-card"
            title={bodega.nombre}
            bordered={false}
            hoverable
            onClick={() => handleCardClick(bodega.nombre)}
          >
            {bodega.nombre}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

// Prop types to ensure proper use of the component
GestionInventarioCard.propTypes = {
  bodegas: PropTypes.array.isRequired,
  handleCardClick: PropTypes.func.isRequired,
};

export default GestionInventarioCard;
