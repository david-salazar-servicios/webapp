import React from 'react';
import { Card, Col, Row, Empty } from 'antd'; // Added 'Empty' component from antd
import PropTypes from 'prop-types';

const GestionInventarioCard = ({ inventarios, handleCardClick }) => {
  // Check if there are inventories to display
  if (inventarios.length === 0) {
    return <Empty description="No Inventories Available" />;
  }

  return (
    <Row gutter={[16, 16]} justify="center">
      {inventarios.map((inventario) => (
        <Col key={inventario.id_inventario} xs={24} sm={12} md={8} lg={12}>
          <Card
            className="bodega-card"
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

// Prop types for type checking
GestionInventarioCard.propTypes = {
  inventarios: PropTypes.array.isRequired,
  handleCardClick: PropTypes.func.isRequired,
};

export default GestionInventarioCard;
