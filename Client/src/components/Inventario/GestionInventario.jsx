import React, { useState, useEffect, useMemo } from 'react';
import { Modal, Row, Col, Card, Table, Form, Input, Button, Select } from 'antd';
import {
    useGetInventariosProductosQuery,
    useGetInventariosQuery,
} from '../../features/Inventario/InventarioApiSlice';
import GestionInventarioTable from './GestionInventarioTable';
import GestionInventarioCard from './GestionInventarioCard';
import Catalogo from './Catalogo';
import InventarioPieChart from './InventarioPieChart';

const { Option } = Select;

const GestionInventario = () => {
    const [selectedBodega, setSelectedBodega] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null); // New state for product

    const { data: inventariosProductos, refetch: refetchProductos, isSuccess: isProductosSuccess } =
        useGetInventariosProductosQuery();
    const { data: inventarios, refetch: refetchInventarios, isSuccess: isInventariosSuccess } =
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
        setSelectedProduct(product); // Populate form with selected product
    };

    const handleMoveProduct = (targetInventory) => {
        console.log(`Moving product to ${targetInventory}`);
        // Implement the API call or logic to move the product here
    };

    const filteredData = selectedBodega
        ? inventariosProductos?.filter((inventario) => inventario.nombre_inventario === selectedBodega)
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
                        <h3>Productos con Cantidad Mínima</h3>
                        {isProductosSuccess ? (
                            <InventarioPieChart productos={inventariosProductos || []} />
                        ) : (
                            <p>Loading products...</p>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={8}>
                    <Card bordered={false} className="equal-height-card">
                        <h3>Total de Productos</h3>
                        <Table columns={summaryColumns} dataSource={totalProducts} pagination={false} />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col xs={24} md={16} className="equal-height-col">
                    <Card bordered={false} className="equal-height-card">
                        <h3>{`Productos en ${selectedBodega || 'Inventario'}`}</h3>
                        {selectedBodega && isProductosSuccess ? (
                            <GestionInventarioTable
                                data={filteredData[0]?.productos || []}
                                handleInputChange={handleInputChange}
                                onRowSelect={onRowSelect}
                                onOpenCatalogo={() => setIsModalVisible(true)}
                            />
                        ) : (
                            <p>Select an inventory to view products.</p>
                        )}
                    </Card>
                </Col>

                <Col xs={24} md={8} className="equal-height-col">
                    <Card bordered={false} className="equal-height-card">
                        <h3>Move Product</h3>
                        <Form layout="vertical">
                            <Form.Item label="Product Name">
                                <Input value={selectedProduct?.nombre_producto || ''} readOnly />
                            </Form.Item>
                            <Form.Item label="Quantity">
                                <Input value={selectedProduct?.cantidad || ''} readOnly />
                            </Form.Item>
                            <Form.Item label="Move to Inventory">
                                <Select
                                    placeholder="Select target inventory"
                                    onChange={handleMoveProduct}
                                >
                                    {inventarios.map((inv) => (
                                        <Option key={inv.id} value={inv.nombre_inventario}>
                                            {inv.nombre_inventario}
                                        </Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" onClick={() => handleMoveProduct('Principal')}>
                                    Move to Principal
                                </Button>
                                <Button
                                    style={{ marginLeft: '8px' }}
                                    onClick={() => handleMoveProduct('Another Inventory')}
                                >
                                    Move to Another Inventory
                                </Button>
                            </Form.Item>
                        </Form>
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
