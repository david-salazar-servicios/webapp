import React from 'react';
import { Card, Col, Row, Empty } from 'antd';
import PropTypes from 'prop-types';

const GestionInventarioCard = ({ inventarios, handleCardClick, selectedBodega }) => {
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
            onClick={() => handleCardClick(inventario)}
            style={{
              backgroundColor: inventario.id_inventario === selectedBodega?.id_inventario ? '#1677ff' : '#fff', // primary blue color if selected
              color: inventario.id_inventario === selectedBodega?.id_inventario ? '#fff' : '#000', // white text if selected
            }}
          >
            {inventario.nombre_inventario}
          </Card>
        </Col>
      ))}
    </Row>
  );
};

GestionInventarioCard.propTypes = {
  inventarios: PropTypes.array.isRequired,
  handleCardClick: PropTypes.func.isRequired,
  selectedBodega: PropTypes.object, // Prop for selected inventory
};

export default GestionInventarioCard;
