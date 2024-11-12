import React, { useState, useEffect } from 'react';
import { Table, Button, Input, Space } from 'antd';
import { FileImageTwoTone, SearchOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { useUpdateCantidadInventarioProductoMutation, useUpdateEstanteInventarioProductoMutation } from '../../features/Inventario/InventarioApiSlice';

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
  const [editingCantidadKey, setEditingCantidadKey] = useState(null);
  const [editingEstanteKey, setEditingEstanteKey] = useState(null);
  const [cantidadRecomendada, setCantidadRecomendada] = useState({});
  const [estante, setEstante] = useState({});
  const [updateCantidadInventarioProducto] = useUpdateCantidadInventarioProductoMutation();
  const [updateEstanteInventarioProducto] = useUpdateEstanteInventarioProductoMutation();

  console.log(data)
  useEffect(() => {
    const sortedData = [...data].sort((a, b) =>
      a.nombre_producto.localeCompare(b.nombre_producto)
    );
    setFilteredData(sortedData);
  }, [data]);

  useEffect(() => {
    setEditingCantidadKey(null);
    setEditingEstanteKey(null);
    setCantidadRecomendada({});
    setEstante({});
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

  const isEditingCantidad = (record) => record.codigo_producto === editingCantidadKey;
  const isEditingEstante = (record) => record.codigo_producto === editingEstanteKey;

  const editCantidad = (record) => {
    setEditingCantidadKey(record.codigo_producto);
    setCantidadRecomendada({ [record.codigo_producto]: record.cantidad_recomendada });
  };

  const editEstante = (record) => {
    setEditingEstanteKey(record.codigo_producto);
    setEstante({ [record.codigo_producto]: record.estante });
  };

  const cancelCantidad = () => {
    setEditingCantidadKey(null);
    setCantidadRecomendada({});
  };

  const cancelEstante = () => {
    setEditingEstanteKey(null);
    setEstante({});
  };

  const saveCantidad = async (record) => {
    const newCantidad = cantidadRecomendada[record.codigo_producto];
    try {
      await updateCantidadInventarioProducto({
        id_inventario: selectedBodega.id_inventario,
        id_producto: record.id_producto,
        cantidadRecomendada: newCantidad,
      }).unwrap();

      handleInputChange(record.codigo_producto, newCantidad);
      cancelCantidad();
    } catch (error) {
      console.error("Failed to update product quantity:", error);
    }
  };

  const saveEstante = async (record) => {
    console.log("saveEstante function triggered with record:", record);
    const newEstante = estante[record.codigo_producto];
    try {
        await updateEstanteInventarioProducto({
            id_inventario: selectedBodega.id_inventario,
            id_producto: record.id_producto,
            estante: newEstante,
        }).unwrap();

        const updatedData = filteredData.map(item =>
            item.codigo_producto === record.codigo_producto ? { ...item, estante: newEstante } : item
        );
        setFilteredData(updatedData);
        cancelEstante();
    } catch (error) {
        console.error("Failed to update estante:", error);
    }
};


  const handleCantidadChange = (e, codigo_producto) => {
    setCantidadRecomendada((prev) => ({
      ...prev,
      [codigo_producto]: e.target.value,
    }));
  };

  const handleEstanteChange = (e, codigo_producto) => {
    setEstante((prev) => ({
      ...prev,
      [codigo_producto]: e.target.value,
    }));
  };

  const columns = [
    {
      title: 'Estante',
      dataIndex: 'estante',
      key: 'estante',
      width: editingEstanteKey ? 200 : 150, // expanded width when editing
      render: (_, record) =>
        isEditingEstante(record) ? (
          <Space>
            <Input
              value={estante[record.codigo_producto]}
              onChange={(e) => handleEstanteChange(e, record.codigo_producto)}
              onKeyDown={(e) => e.key === 'Enter' && saveEstante(record)}
              style={{ width: '100px' }}
            />
            <div onClick={() => saveEstante(record)} style={{ ...iconButtonStyle, background: '#1677ff', color: 'white' }}>
              <CheckOutlined />
            </div>
            <div onClick={cancelEstante} style={{ ...iconButtonStyle, color: 'grey' }}>
              <CloseOutlined />
            </div>
          </Space>
        ) : (
          <span 
            onClick={() => editEstante(record)} 
            style={{
              color: 'black', 
              cursor: 'pointer', 
              display: 'inline-block',
              width: '100px', 
              padding: '4px',
              border: '1px solid #d9d9d9', 
              borderRadius: '4px'
            }}
          >
            {record.estante || ' - '}
          </span>
        ),
    },
    { title: 'Código', dataIndex: 'codigo_producto', key: 'codigo_producto', width: 120 },
    { title: 'Producto', dataIndex: 'nombre_producto', key: 'nombre_producto', width: 150 },
    { title: 'Unidad de Medida', dataIndex: 'unidad_medida', key: 'unidad_medida', width: 120 },
    {
      title: 'Cantidad Existente',
      key: 'cantidad',
      dataIndex: 'cantidad',
      width: 120,
      render: (text) => (
        <span style={{ backgroundColor: '#e6b8af', padding: '8px', display: 'block', borderRadius: '4px' }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Cantidad Recomendada',
      dataIndex: 'cantidad_recomendada',
      key: 'cantidad_recomendada',
      width: editingCantidadKey ? 200 : 150, // expanded width when editing
      render: (_, record) =>
        isEditingCantidad(record) ? (
          <Space>
            <Input
              value={cantidadRecomendada[record.codigo_producto]}
              onChange={(e) => handleCantidadChange(e, record.codigo_producto)}
              onKeyDown={(e) => e.key === 'Enter' && saveCantidad(record)}
              style={{ width: '100px' }}
            />
            <div onClick={() => saveCantidad(record)} style={{ ...iconButtonStyle, background: '#1677ff', color: 'white' }}>
              <CheckOutlined />
            </div>
            <div onClick={cancelCantidad} style={{ ...iconButtonStyle, color: 'grey' }}>
              <CloseOutlined />
            </div>
          </Space>
        ) : (
          <span 
            onClick={() => editCantidad(record)} 
            style={{
              color: 'black', 
              cursor: 'pointer', 
              display: 'inline-block',
              width: '100px', 
              padding: '4px',
              border: '1px solid #d9d9d9', 
              borderRadius: '4px',
              backgroundColor: '#c9e7b8' // green background
            }}
          >
            {record.cantidad_recomendada || '0.00'}
          </span>
        ),
    },
    {
      title: 'Cantidad Solicitud',
      key: 'solicitud',
      width: 120,
      render: (_, record) => (
        <span style={{ backgroundColor: '#fff2cc', padding: '8px', display: 'block', borderRadius: '4px' }}>
          {(record.cantidad_recomendada || 0) - (record.cantidad || 0)}
        </span>
      ),
    },
    {
      title: 'Precio Costo',
      dataIndex: 'precio_costo',
      key: 'precio_costo',
      width: 150,
      render: (text) => (
        <span>₡ {text}</span>
      ),
    },
    {
      title: 'Precio Venta',
      dataIndex: 'precio_venta',
      key: 'precio_venta',
      width: 150,
      render: (text) => (
        <span>₡ {text}</span>
      ),
    },
    {
      title: 'Inversión',
      key: 'inversion',
      width: 150,
      render: (_, record) => (
        <span>
          ₡ {(record.precio_costo || 0) * (record.cantidad || 0)}
        </span>
      ),
    },
    {
      title: '',
      dataIndex: 'imagen',
      key: 'imagen',
      render: (text) => (
        <FileImageTwoTone
          style={{ fontSize: '24px', cursor: 'pointer' }}
          onClick={() => {
            if (text) window.open(text, '_blank');
          }}
        />
      ),
      width: 70,
    },
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
  selectedBodega: PropTypes.object.isRequired,
};

export default GestionInventarioTable;
