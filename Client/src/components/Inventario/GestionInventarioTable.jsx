import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space } from 'antd';
import { FileImageTwoTone, SearchOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useUpdateCantidadInventarioProductoMutation } from '../../features/Inventario/InventarioApiSlice';

const iconButtonStyle = {
  border: '1px solid #d9d9d9',
  borderRadius: '4px',
  padding: '4px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '16px',
  width: '24px',
  height: '24px',
};

const GestionInventarioTable = ({
  data,
  handleInputChange,
  onOpenCatalogo,
  onRowSelect,
  selectedBodega,
  selectedProduct
}) => {
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [cantidadRecomendada, setCantidadRecomendada] = useState({});
  const [updateCantidadInventarioProducto] = useUpdateCantidadInventarioProductoMutation();

  useEffect(() => {
    const sortedData = [...data].sort((a, b) =>
      a.nombre_producto.localeCompare(b.nombre_producto)
    );
    setFilteredData(sortedData);
  }, [data]);

  useEffect(() => {
    setEditingKey('');
    setCantidadRecomendada({});
  }, [selectedBodega]);

  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = data
      .filter((item) =>
        item.codigo_producto.toString().toLowerCase().includes(value.toLowerCase()) ||
        item.nombre_producto.toLowerCase().includes(value.toLowerCase()) ||
        item.unidad_medida.toLowerCase().includes(value.toLowerCase())
      )
      .sort((a, b) => a.nombre_producto.localeCompare(b.nombre_producto));
    setFilteredData(filtered);
  };

  const isEditing = (record) => record.codigo_producto === editingKey;

  const edit = (record) => {
    setEditingKey(record.codigo_producto);
    setCantidadRecomendada({ [record.codigo_producto]: record.cantidad_recomendada });
  };

  const cancel = () => {
    setEditingKey('');
    setCantidadRecomendada({});
  };

  const save = async (record) => {
    const newCantidad = cantidadRecomendada[record.codigo_producto];
    try {
      await updateCantidadInventarioProducto({
        id_inventario: selectedBodega.id_inventario,
        id_producto: record.id_producto,
        cantidadRecomendada: newCantidad,
      }).unwrap();

      handleInputChange(record.codigo_producto, newCantidad);
      cancel();
    } catch (error) {
      console.error("Failed to update product quantity:", error);
    }
  };

  const handleCantidadChange = (e, codigo_producto) => {
    setCantidadRecomendada((prev) => ({
      ...prev,
      [codigo_producto]: e.target.value,
    }));
  };

  const columns = [
    { title: 'Código Producto', dataIndex: 'codigo_producto', key: 'codigo_producto', width: 120 },
    { title: 'Nombre del Producto', dataIndex: 'nombre_producto', key: 'nombre_producto', width: 150 },
    { title: 'Unidad de Medida', dataIndex: 'unidad_medida', key: 'unidad_medida', width: 120 },
    { title: 'Cantidad Existente', key: 'cantidad', dataIndex: 'cantidad', width: 150 },
    {
      title: 'Cantidad Recomendada',
      dataIndex: 'cantidad_recomendada',
      key: 'cantidad_recomendada',
      width: 150,
      render: (_, record) =>
        isEditing(record) ? (
          <Space>
            <Input
              value={cantidadRecomendada[record.codigo_producto]}
              onChange={(e) => handleCantidadChange(e, record.codigo_producto)}
              onKeyDown={(e) => e.key === 'Enter' && save(record)}
              style={{ width: '100px' }}
            />
            <div onClick={() => save(record)} style={{ ...iconButtonStyle, background: '#1677ff', color: 'white' }}>
              <CheckOutlined />
            </div>
            <div onClick={cancel} style={{ ...iconButtonStyle, color: 'grey' }}>
              <CloseOutlined />
            </div>
          </Space>
        ) : (
          <span onClick={() => edit(record)} style={{ color: 'black', cursor: 'pointer' }}>
            {record.cantidad_recomendada}
          </span>
        ),
    },
    { title: 'Precio Costo', dataIndex: 'precio_costo', key: 'precio_costo', width: 150 },
    { title: 'Precio Venta', dataIndex: 'precio_venta', key: 'precio_venta', width: 150 },
    { title: 'Imagen', dataIndex: 'imagen', key: 'imagen', render: () => <FileImageTwoTone style={{ fontSize: '24px' }} />, width: 70 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="table-header" style={{ display: 'flex', alignItems: 'center', padding: '10px', position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
        <Input
          placeholder="Buscar por ID, nombre o unidad de medida"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: '300px' }}
          prefix={<SearchOutlined />}
        />
        <Button type="primary" onClick={onOpenCatalogo} style={{ marginLeft: '10px' }}>
          Ver Catálogo
        </Button>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
      <div style={{ flex: 1, overflowY: 'auto', maxHeight: '400px' }}>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{ position: ['bottomRight'], pageSize: 5 }}
          rowKey="codigo_producto"
          onRow={(record) => ({
            onClick: () => onRowSelect(record),
          })}
          rowClassName={(record) => 
            record.codigo_producto === selectedProduct?.codigo_producto ? 'selected-row' : ''
          }
          sticky // Makes the header sticky
        />
      </div>


      </div>
    </div>
  );
};

GestionInventarioTable.propTypes = {
  data: PropTypes.array.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  onOpenCatalogo: PropTypes.func.isRequired,
  onRowSelect: PropTypes.func.isRequired,
  selectedBodega: PropTypes.object.isRequired,
};

export default GestionInventarioTable;
