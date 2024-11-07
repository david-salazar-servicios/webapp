import React, { useState, useMemo } from 'react';
import { Card, Table, Input } from 'antd';

const TotalesTable = ({ inventariosProductos }) => {
  const [searchTerm, setSearchTerm] = useState('');
console.log(inventariosProductos)
  // Filtered data with search
  const filteredData = useMemo(() => {
    const productMap = new Map();
    inventariosProductos.forEach((inv) => {
      inv.productos.forEach((prod) => {
        const key = `${prod.nombre_producto}-${prod.unidad_medida}`;
        const existingQuantity = productMap.get(key) || 0;
        const newQuantity = existingQuantity + Number(prod.cantidad);
        productMap.set(key, newQuantity);
      });
    });

    return Array.from(productMap.entries())
      .map(([key, cantidad]) => {
        const [nombre, unidad_medida] = key.split('-');
        return { key, nombre, unidad_medida, cantidad: cantidad.toFixed(2) };
      })
      .filter((item) =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [inventariosProductos, searchTerm]);

  return (
    <Card bordered={false} className="equal-height-card">
      <h3>Total de Productos</h3>
      <Input
        placeholder="Buscar producto..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '16px' }}
      />
      <Table
        columns={[
          { title: 'Producto', dataIndex: 'nombre', key: 'nombre' },
          { title: 'Cantidad Total', dataIndex: 'cantidad', key: 'cantidad' },
          { title: 'Unidad Medida', dataIndex: 'unidad_medida', key: 'unidad_medida' },
        ]}
        dataSource={filteredData}
        pagination={false}
        sticky
        scroll={{ y: 250 }}
        style={{ maxHeight: '300px', overflowY: 'auto' }}
      />
    </Card>
  );
};

export default TotalesTable;
