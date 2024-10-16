import React from 'react';
import { Card, Col, Row } from 'antd';
import PropTypes from 'prop-types'; // For prop types

const GestionInventarioCard = ({ inventarios, handleCardClick }) => {
  return (
    <Row gutter={[16, 16]} justify="center">
      {inventarios.map((inventario) => (
        <Col key={inventario.id_inventario} xs={24} sm={12} md={8} lg={6}>
          <Card
            className="bodega-card"
            title={inventario.nombre_inventario}
            bordered={false}
            hoverable
            onClick={() => handleCardClick(inventario.nombre_inventario)}
          >
            {inventario.nombre_inventario}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

// Prop types to ensure proper use of the component
GestionInventarioCard.propTypes = {
    inventarios: PropTypes.array.isRequired,
  handleCardClick: PropTypes.func.isRequired,
};

export default GestionInventarioCard;
