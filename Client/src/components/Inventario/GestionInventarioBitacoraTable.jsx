import React, { useState, useEffect } from 'react';
import { Card, Table, Input } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useGetBitacoraQuery } from '../../features/bitacora/bitacoraApiSlice';

const BitacoraMovimientosTable = () => {
  const { data: bitacora, error, isLoading } = useGetBitacoraQuery();
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (bitacora) {
      // Filter data to include only entries where module is "Inventario"
      const inventarioData = bitacora
        .filter((item) => item.module === 'Inventario')
        .map((item) => ({
          key: item.id,
          usuario: item.username,
          descripcion: item.description,
          fecha: item.date_performed,
          modulo: item.module,
        }))
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha)); // Sort by date, newest first

      setFilteredData(inventarioData);
    }
  }, [bitacora]);

  const handleSearch = (value) => {
    setSearchText(value);

    if (value.trim() === '') {
      // Reset to original filtered data if search text is empty
      setFilteredData(
        bitacora
          .filter((item) => item.module === 'Inventario')
          .map((item) => ({
            key: item.id,
            usuario: item.username,
            descripcion: item.description,
            fecha: item.date_performed,
            modulo: item.module,
          }))
      );
      return;
    }

    // Filter based on search text by description or username
    const filtered = filteredData.filter((item) =>
      item.descripcion.toLowerCase().includes(value.toLowerCase()) ||
      item.usuario.toLowerCase().includes(value.toLowerCase())
    );

    setFilteredData(filtered);
  };

  return (
    <Card bordered={false} className="equal-height-card">
      <h3>Movimientos de Inventario</h3>
      <Input
        placeholder="Buscar por descripción o usuario"
        value={searchText}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: '16px', width: '300px' }}
        prefix={<SearchOutlined />}
      />
      <Table
        columns={[
          { title: 'Usuario', dataIndex: 'usuario', key: 'usuario' },
          { title: 'Descripción', dataIndex: 'descripcion', key: 'descripcion' },
          { title: 'Fecha', dataIndex: 'fecha', key: 'fecha' },
        ]}
        dataSource={filteredData}
        pagination={false}
        loading={isLoading}
        scroll={{ y: 250 }}
        style={{ maxHeight: '300px', overflowY: 'auto' }}
      />
      {error && <p>Error loading data: {error.message}</p>}
    </Card>
  );
};

export default BitacoraMovimientosTable;