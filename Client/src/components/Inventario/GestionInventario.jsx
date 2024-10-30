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

  const { data: inventariosProductos = [], refetch: refetchProductos, isSuccess: isProductosSuccess } =
    useGetInventariosProductosQuery();
  const { data: inventarios = [], refetch: refetchInventarios, isSuccess: isInventariosSuccess } =
    useGetInventariosQuery();

  useEffect(() => {
    if (isProductosSuccess && isInventariosSuccess && inventarios.length > 0) {
      refetchProductos();
      setSelectedBodega((prev) => prev || inventarios[0].nombre_inventario);
    }
  }, [isInventariosSuccess, inventarios, isProductosSuccess, inventariosProductos]);

  const handleProductChange = () => {
    refetchProductos();
    refetchInventarios();
  };

  const handleCardClick = (nombre_inventario) => {
    setSelectedBodega(nombre_inventario);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    handleProductChange();
  };

  const handleInputChange = (key, value) => {
    const updatedData = inventariosProductos.map((item) => {
      if (item.key === key) {
        return { ...item, cantidad: value };
      }
      return item;
    });
  };

  const onRowSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleMoveProduct = (targetInventory) => {
    console.log(`Moving product to ${targetInventory}`);
    // Implement the API call or logic to move the product here
  };

  const filteredData = selectedBodega
    ? inventariosProductos?.filter(
        (inventario) => inventario.nombre_inventario === selectedBodega
      ) || []
    : [];

  const totalProducts = useMemo(() => {
    const productMap = new Map();
    inventariosProductos?.forEach((inventario) => {
      inventario.productos.forEach((producto) => {
        const currentQuantity = productMap.get(producto.nombre_producto) || 0;
        productMap.set(
          producto.nombre_producto,
          currentQuantity + parseFloat(producto.cantidad)
        );
      });
    });

    return Array.from(productMap.entries()).map(([nombre, cantidad]) => ({
      key: nombre,
      nombre,
      cantidad,
    }));
  }, [inventariosProductos]);

  const summaryColumns = [
    { title: 'Producto', dataIndex: 'nombre', key: 'nombre' },
    { title: 'Cantidad Total', dataIndex: 'cantidad', key: 'cantidad' },
  ];

  return (
    <div className="gestion-inventario-container">
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24} md={8}>
          <Card bordered={false} className="equal-height-card">
            <h3>Inventarios</h3>
            {inventarios?.length ? (
              <GestionInventarioCard
                inventarios={inventarios}
                handleCardClick={handleCardClick}
              />
            ) : (
              <p>No inventories to display.</p>
            )}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} className="equal-height-card">
            <h3>Move Product</h3>
            <MoverProductosForm
              selectedProduct={selectedProduct}
              inventarios={inventarios}
              selectedBodega={selectedBodega}
              handleMoveProduct={handleMoveProduct}
            />
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card bordered={false} className="equal-height-card">
            <Tabs defaultActiveKey="1">
              <TabPane tab="Total de Productos" key="1">
                <Table
                  columns={summaryColumns}
                  dataSource={totalProducts}
                  pagination={false}
                />
              </TabPane>
              <TabPane tab="Productos con Cantidad Mínima" key="2">
                {isProductosSuccess ? (
                  <InventarioPieChart productos={inventariosProductos || []} />
                ) : (
                  <p>Loading products...</p>
                )}
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
  <Col xs={24} md={24}>
    <Card 
      bordered={false} 
      style={{ height: '100%', overflow: 'hidden' }} // Ensure the Card takes full space and hides overflow
    >
      <h3>{`Productos en ${selectedBodega || 'Inventario'}`}</h3>
      {selectedBodega && isProductosSuccess ? (
        <div> {/* Scroll if content overflows */}
          <GestionInventarioTable
            data={filteredData[0]?.productos || []}
            handleInputChange={handleInputChange}
            onRowSelect={onRowSelect}
            onOpenCatalogo={() => setIsModalVisible(true)}
          />
        </div>
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
        <Catalogo productos={inventariosProductos} onProductChange={handleProductChange} />
      </Modal>
    </div>
  );
};

export default GestionInventario;
