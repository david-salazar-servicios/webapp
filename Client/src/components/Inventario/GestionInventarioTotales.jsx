import React, { useState, useEffect } from 'react';
import { Card, Table, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const TotalesTable = ({ inventariosProductos }) => {
  const [searchText, setSearchText] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    // Transform and organize the product data, then sort alphabetically
    const productMap = new Map();
    inventariosProductos.forEach((inv) => {
      inv.productos.forEach((prod) => {
        const key = `${prod.codigo_producto}-${prod.nombre_producto}-${prod.unidad_medida}`;
        const existingProduct = productMap.get(key);
        const existingQuantity = existingProduct ? existingProduct.cantidad : 0;
        const newQuantity = existingQuantity + Number(prod.cantidad || 0);
        productMap.set(key, { ...prod, cantidad: newQuantity });
      });
    });

    // Convert Map to array and apply initial sorting
    const initialData = Array.from(productMap.values())
      .map((prod) => ({
        key: prod.codigo_producto,
        codigo_producto: prod.codigo_producto,
        nombre: prod.nombre_producto,
        unidad_medida: prod.unidad_medida,
        cantidad: Number(prod.cantidad).toFixed(2),
      }))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));

    setOriginalData(initialData); // Store the full dataset
    setFilteredData(initialData); // Display the full dataset initially
  }, [inventariosProductos]);

  const handleSearch = (value) => {
    setSearchText(value);

    // If search text is empty, reset to original data
    if (value.trim() === '') {
      setFilteredData(originalData);
      return;
    }

    // Filter data based on search input (only by code or product name)
    const filtered = originalData.filter((item) =>
      item.codigo_producto.toString().toLowerCase().includes(value.toLowerCase()) ||
      item.nombre.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  return (
    <>
      <div className="card-container"
        style={{
          boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', // Sombra suave
          borderRadius: '8px', // Bordes redondeados
          padding: '16px', // Espaciado interno
          backgroundColor: '#fff', // Fondo blanco
        }}>
        <h3>Total de Productos</h3>
        <Input
          placeholder="Buscar por código o producto"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ marginBottom: '16px', width: '300px' }}
          prefix={<SearchOutlined />}
        />

        <Table
          columns={[
            { title: 'Código', dataIndex: 'codigo_producto', key: 'codigo_producto', width: 120 },
            { title: 'Producto', dataIndex: 'nombre', key: 'nombre', width: 200 },
            { title: 'Cantidad Total', dataIndex: 'cantidad', key: 'cantidad', width: 150 },
            { title: 'Unidad Medida', dataIndex: 'unidad_medida', key: 'unidad_medida', width: 150 },
          ]}
          dataSource={filteredData}
          pagination={false}
          sticky
          scroll={{ y: 300 }}
        />
      </div>
    </>
  );
};

export default TotalesTable;
