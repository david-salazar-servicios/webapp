import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { useGetInventariosProductosQuery, useGetInventariosQuery } from '../../features/Inventario/InventarioApiSlice';
import Catalogo from './Catalogo'; // Assuming this is the catalog component
import GestionInventarioTable from './GestionInventarioTable'; // Import the table component
import GestionInventarioCard from './GestionInventarioCard'; // Import the cards component

const GestionInventario = () => {
  const [selectedBodega, setSelectedBodega] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Fetch inventarios and their productos
  const { data: inventariosProductos } = useGetInventariosProductosQuery();
  const { data: inventarios } = useGetInventariosQuery();

  // Function to handle card click
  const handleCardClick = (bodega) => {
    if (bodega === 'Catalogo') {
      setIsModalVisible(true);
    } else {
      setSelectedBodega(bodega);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Function to handle quantity change in the table
  const handleInputChange = (key, value) => {
    const updatedData = inventariosProductos.map((item) => {
      if (item.key === key) {
        return { ...item, cantidad: value };
      }
      return item;
    });
    // Logic to update the API could go here
  };

  // Filter data for the selected bodega
  const filteredData = selectedBodega
    ? inventariosProductos.filter(
        (item) => item.bodega === selectedBodega
      )
    : [];

  return (
    <div className="gestion-inventario-container">
      {/* Render the GestionInventarioCard component */}
      <GestionInventarioCard bodegas={inventarios || []} handleCardClick={handleCardClick} />

      {/* Render the GestionInventarioTable based on selected Bodega */}
      {selectedBodega && (
        <GestionInventarioTable data={filteredData} handleInputChange={handleInputChange} />
      )}

      {/* Modal for Catalogo */}
      <Modal
        title="Catálogo de Productos"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="close" onClick={handleCancel}>
            Cerrar
          </Button>,
        ]}
        width={1000}
      >
        <Catalogo productos={inventariosProductos} />
      </Modal>
    </div>
  );
};

export default GestionInventario;
