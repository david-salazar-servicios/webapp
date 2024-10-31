import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Card } from 'antd';
import { FileImageTwoTone, SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const GestionInventarioTable = ({
  data,
  handleInputChange,
  onOpenCatalogo,
  onRowSelect,
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  // Update filteredData when the data prop changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  const handleSearch = (value) => {
    setSearchText(value);

    const filtered = data.filter((item) =>
      item.codigo_producto.toString().toLowerCase().includes(value.toLowerCase()) || // Search by product code
      item.nombre_producto.toLowerCase().includes(value.toLowerCase()) ||
      item.unidad_medida.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  const columns = [
    {
      title: 'Código Producto',
      dataIndex: 'codigo_producto',
      key: 'codigo_producto',
      width: 120,
      fixed: 'left',
    },
    {
      title: 'Nombre del Producto',
      dataIndex: 'nombre_producto',
      key: 'nombre_producto',
      width: 150,
    },
    {
      title: 'Unidad de Medida',
      dataIndex: 'unidad_medida',
      key: 'unidad_medida',
      width: 120,
    },
    {
      title: 'Cantidad Existente',
      key: 'cantidad',
      dataIndex: 'cantidad',
      width: 150,
    },
    {
      title: 'Cantidad Recomendada',
      dataIndex: 'cantidad_recomendada',
      key: 'cantidad_recomendada',
      width: 150,
    },
    {
      title: 'Precio Costo',
      dataIndex: 'precio_costo',
      key: 'precio_costo',
      width: 150,
    },
    {
      title: 'Precio Venta',
      dataIndex: 'precio_venta',
      key: 'precio_venta',
      width: 150,
    },
    {
      title: 'Imagen',
      dataIndex: 'imagen',
      key: 'imagen',
      render: () => <FileImageTwoTone style={{ fontSize: '24px' }} />,
      width: 70,
    },
  ];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <div
        className="table-header"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px',
          borderBottom: '1px solid #f0f0f0',
          backgroundColor: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 2,
        }}
      >
        <Input
          placeholder="Buscar por ID, nombre o unidad de medida"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '300px' }}
          prefix={<SearchOutlined />}
        />
        <Button
          type="primary"
          onClick={onOpenCatalogo}
          style={{ marginLeft: '10px' }}
        >
          Ver Catálogo
        </Button>
      </div>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          maxHeight: '400px',
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ position: ['bottomRight'], pageSize: 5 }}
          rowKey="codigo_producto"
          onRow={(record) => ({
            onClick: () => onRowSelect(record),
          })}
          sticky
        />
      </div>
    </div>
  );
};

GestionInventarioTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onOpenCatalogo: PropTypes.func.isRequired,
  onRowSelect: PropTypes.func.isRequired,
};

export default GestionInventarioTable;
