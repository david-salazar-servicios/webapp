import React, { useState } from 'react';
import { Card, Col, Row, Table, Space } from 'antd';
import { FileImageTwoTone } from '@ant-design/icons';
import { InputNumber } from 'primereact/inputnumber'; // Importing the PrimeReact InputNumber component
import { useNavigate } from 'react-router-dom';

const columns = (handleInputChange) => [
  {
    title: 'ID Producto',
    dataIndex: 'id_producto',
    key: 'id_producto',
  },
  {
    title: 'Nombre del Producto',
    dataIndex: 'nombre_producto',
    key: 'nombre_producto',
  },
  {
    title: 'Unidad de Medida',
    dataIndex: 'unidad_medida',
    key: 'unidad_medida',
  },
  {
    title: 'Imagen',
    dataIndex: 'imagen',
    key: 'imagen',
    render: () => <FileImageTwoTone style={{ fontSize: '24px' }} />, // Using the Ant Design icon for the image
  },
  {
    title: 'Cantidad',
    key: 'cantidad',
    render: (_, record) => (
        <InputNumber
        value={record.cantidad}
        onValueChange={(e) => handleInputChange(record.key, e.value)} // Handle change here
        mode="decimal"
        showButtons
        min={0}
        max={100}
        className="custom-input-number" // Adding custom class for button styling
      />
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Editar {record.nombre_producto}</a>
        <a>Eliminar</a>
      </Space>
    ),
  },
];

const initialData = [
  {
    key: '1',
    id_producto: 'P001',
    nombre_producto: 'Producto 1',
    unidad_medida: 'Unidad',
    cantidad: 2, // Example quantity
  },
  {
    key: '2',
    id_producto: 'P002',
    nombre_producto: 'Producto 2',
    unidad_medida: 'Metros',
    cantidad: 5, // Example quantity
  },
  {
    key: '3',
    id_producto: 'P003',
    nombre_producto: 'Producto 3',
    unidad_medida: 'Unidad',
    cantidad: 3, // Example quantity
  },
];

const GestionInventario = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(initialData);

  // Function to handle InputNumber change
  const handleInputChange = (key, value) => {
    const updatedData = data.map((item) => {
      if (item.key === key) {
        return { ...item, cantidad: value };
      }
      return item;
    });
    setData(updatedData);
  };

  const handleCardClick = (bodega) => {
    // Navigate to the specific bodega
    console.log(`Navigating to ${bodega}`);
    // navigate(`/inventario/${bodega.toLowerCase().replace(' ', '-')}`);
  };

  return (
    <div className="gestion-inventario-container">
      <Row gutter={[16, 16]} justify="center">
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            className="bodega-card"
            title="Bodega Central"
            bordered={false}
            hoverable
            onClick={() => handleCardClick('Bodega Central')}
          >
            Bodega Central
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            className="bodega-card"
            title="Bodega 1"
            bordered={false}
            hoverable
            onClick={() => handleCardClick('Bodega 1')}
          >
            Bodega 1
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            className="bodega-card"
            title="Bodega 2"
            bordered={false}
            hoverable
            onClick={() => handleCardClick('Bodega 2')}
          >
            Bodega 2
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Card
            className="bodega-card"
            title="Bodega 3"
            bordered={false}
            hoverable
            onClick={() => handleCardClick('Bodega 3')}
          >
            Bodega 3
          </Card>
        </Col>
      </Row>

      {/* Table Component below the cards */}
      <div style={{ marginTop: '30px' }}>
        <Table
          columns={columns(handleInputChange)}
          dataSource={data}
          pagination={{
            position: ['bottomRight'], // Bottom-right pagination
          }}
        />
      </div>
    </div>
  );
};

export default GestionInventario;
