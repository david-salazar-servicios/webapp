import React, { useState, useEffect } from 'react';
import { Modal, Row, Col, Card, Tabs } from 'antd';
import {
  useGetInventariosProductosQuery,
  useGetInventariosQuery,
} from '../../features/Inventario/InventarioApiSlice';
import GestionInventarioTable from './GestionInventarioTable';
import GestionInventarioCard from './GestionInventarioCard';
import Catalogo from './Catalogo';
import MoverProductosForm from './MoverProductosForm';
import TotalesTable from './GestionInventarioTotales'; // Import the new component

const { TabPane } = Tabs;

const GestionInventario = () => {
  const [selectedBodega, setSelectedBodega] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  const { data: inventariosProductos = [], refetch: refetchProductos, isSuccess: isProductosSuccess } =
    useGetInventariosProductosQuery();
  
  const { data: inventarios = [], isSuccess: isInventariosSuccess } =
    useGetInventariosQuery();

  useEffect(() => {
    if (selectedBodega && isProductosSuccess) {
      const selectedInventoryProducts = inventariosProductos.find(
        (inventario) => inventario.id_inventario === selectedBodega.id_inventario
      );
      setFilteredData(selectedInventoryProducts?.productos || []);
    }
  }, [inventariosProductos, selectedBodega, isProductosSuccess]);

  useEffect(() => {
    if (isInventariosSuccess && inventarios.length > 0) {
      setSelectedBodega(inventarios[0]);
    }
  }, [isInventariosSuccess, inventarios]);

  const handleCardClick = (inventario) => {
    setSelectedBodega(inventario);
    setSelectedProduct(null);
    refetchProductos();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const onRowSelect = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Row gutter={[16, 16]} style={{ flex: 1, marginBottom: '16px' }}>
        <Col xs={24} md={8} style={{ height: '100%' }}>
          <Card bordered={false} className="equal-height-card">
            <h3>Inventarios</h3>
            {inventarios.length ? (
              <GestionInventarioCard
                inventarios={inventarios}
                handleCardClick={handleCardClick}
                selectedBodega={selectedBodega}
              />
            ) : (
              <p>No inventories to display.</p>
            )}
          </Card>
        </Col>

        <Col xs={24} md={8} style={{ height: '100%' }}>
          <Card bordered={false} className="equal-height-card">
            <h3>Gestión Movimientos</h3>
            <MoverProductosForm
              selectedProduct={selectedProduct}
              inventarios={inventarios}
              selectedBodega={selectedBodega}
              handleMoveProduct={(targetInventory) =>
                console.log(`Moving product to ${targetInventory}`)
              }
            />
          </Card>
        </Col>

        <Col xs={24} md={8} style={{ height: '100%' }}>
          <TotalesTable inventariosProductos={inventariosProductos} /> {/* Use the new component */}
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ flex: 1 }}>
        <Col xs={24} md={24} style={{ height: '100%' }}>
          <Card
            bordered={false}
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <h3>{`Productos en Inventario - ${selectedBodega?.nombre_inventario || 'Inventario'}`}</h3>
            {selectedBodega && isProductosSuccess ? (
              <GestionInventarioTable
                data={filteredData}
                handleInputChange={() => {}}
                onRowSelect={onRowSelect}
                onOpenCatalogo={() => setIsModalVisible(true)}
                selectedBodega={selectedBodega}
                selectedProduct={selectedProduct}
              />
            ) : (
              <p>Select an inventory to view products.</p>
            )}
          </Card>
        </Col>
      </Row>

      <Modal
        title="Catálogo de Productos"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={1000}
      >
        <Catalogo productos={inventariosProductos} onProductChange={() => refetchProductos()} />
      </Modal>
    </div>
  );
};

export default GestionInventario;
