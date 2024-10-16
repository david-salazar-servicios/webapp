import React from 'react';
import { Table } from 'antd';
import { FileImageTwoTone } from '@ant-design/icons';
import { InputNumber } from 'primereact/inputnumber'; // PrimeReact InputNumber for quantity
import PropTypes from 'prop-types'; // For prop types

const GestionInventarioTable = ({ data, handleInputChange }) => {
  const columns = [
    {
      title: 'Código Producto',
      dataIndex: 'codigo_producto',
      key: 'codigo_producto',
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
          onValueChange={(e) => handleInputChange(record.key, e.value)}
          mode="decimal"
          showButtons
          min={0}
          max={100}
          className="custom-input-number" // Adding custom class for button styling
        />
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={{ position: ['bottomRight'] }}
    />
  );
};

// Prop types to ensure proper use of the component
GestionInventarioTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
};

export default GestionInventarioTable;
