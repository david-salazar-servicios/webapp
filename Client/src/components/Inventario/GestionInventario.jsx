import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Row, Col, Card, Table, Tabs } from 'antd';
import {
  useGetInventariosProductosQuery,
  useGetInventariosQuery,
} from '../../features/Inventario/InventarioApiSlice';
import GestionInventarioTable from './GestionInventarioTable';
import GestionInventarioCard from './GestionInventarioCard';
import Catalogo from './Catalogo';
import InventarioPieChart from './InventarioPieChart';
import MoverProductosForm from './MoverProductosForm';

const { TabPane } = Tabs;

const GestionInventario = () => {
  const [selectedBodega, setSelectedBodega] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filteredData, setFilteredData] = useState([]);

  // Fetch products and inventories using RTK Query
  const { data: inventariosProductos = [], refetch: refetchProductos, isSuccess: isProductosSuccess } =
    useGetInventariosProductosQuery();
  
  const { data: inventarios = [], isSuccess: isInventariosSuccess } =
    useGetInventariosQuery();

  // Effect to update filtered data when selected inventory changes
  useEffect(() => {
    if (selectedBodega && isProductosSuccess) {
      const selectedInventoryProducts = inventariosProductos.find(
        (inventario) => inventario.nombre_inventario === selectedBodega
      );
      setFilteredData(selectedInventoryProducts?.productos || []);
    }
  }, [inventariosProductos, selectedBodega, isProductosSuccess]);

  // Automatically select the first inventory on load
  useEffect(() => {
    if (isInventariosSuccess && inventarios.length > 0) {
      setSelectedBodega(inventarios[0].nombre_inventario);
    }
  }, [isInventariosSuccess, inventarios]);

  // Handle selection of inventory card
  const handleCardClick = (nombre_inventario) => {
    setSelectedBodega(nombre_inventario);
    refetchProductos(); // Ensure we fetch the latest product data
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
              />
            ) : (
              <p>No inventories to display.</p>
            )}
          </Card>
        </Col>

        <Col xs={24} md={8} style={{ height: '100%' }}>
          <Card bordered={false} className="equal-height-card">
            <h3>Move Product</h3>
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
          <Card bordered={false} className="equal-height-card">
            <Tabs defaultActiveKey="1">
            <TabPane tab="Total de Productos" key="1">
  <Table
    columns={[
      { title: 'Producto', dataIndex: 'nombre', key: 'nombre' },
      
      { title: 'Cantidad Total', dataIndex: 'cantidad', key: 'cantidad' },
      { title: 'Unidad Medida', dataIndex: 'unidad_medida', key: 'unidad_medida' },
    ]}
    dataSource={useMemo(() => {
      const productMap = new Map();

      // Ensure correct grouping and numeric summation
      inventariosProductos.forEach((inv) => {
        inv.productos.forEach((prod) => {
          const key = `${prod.nombre_producto}-${prod.unidad_medida}`; // Unique key for each product-unit combination
          const existingQuantity = productMap.get(key) || 0;

          // Convert the quantity to a number before summing
          const newQuantity = existingQuantity + Number(prod.cantidad);
          productMap.set(key, newQuantity);
        });
      });

      // Convert the Map to an array suitable for the Table
      return Array.from(productMap.entries()).map(([key, cantidad]) => {
        const [nombre, unidad_medida] = key.split('-'); // Extract product name and unit of measurement
        return {
          key,
          nombre,
          unidad_medida,
          cantidad: cantidad.toFixed(2), // Format as number with 2 decimal places
        };
      });
    }, [inventariosProductos])}
    pagination={false}
  />
</TabPane>


              <TabPane tab="Productos con Cantidad Mínima" key="2">
                {isProductosSuccess ? (
                  <InventarioPieChart productos={inventariosProductos} />
                ) : (
                  <p>Loading products...</p>
                )}
              </TabPane>
            </Tabs>
          </Card>
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
            <h3>{`Productos en ${selectedBodega || 'Inventario'}`}</h3>
            {selectedBodega && isProductosSuccess ? (
              <GestionInventarioTable
                data={filteredData}
                handleInputChange={() => {}}
                onRowSelect={onRowSelect}
                onOpenCatalogo={() => setIsModalVisible(true)}
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
