
import React, { useState, useEffect } from 'react';
import { Modal, Table, Input, Button, Checkbox, Card, Row, Col, Typography, Divider } from 'antd';
import { useGetInventariosQuery, useGetInventariosProductosQuery } from '../../features/Inventario/InventarioApiSlice';
import useAuth from "../../hooks/useAuth";

const CatalogoDialog = ({ visible, onHide, onSelectProduct, selectedProducts }) => {
    const { data: inventarios = [] } = useGetInventariosQuery();
    const { data: inventariosProductos = [] } = useGetInventariosProductosQuery();

    const [isMultiInventariosEnabled, setIsMultiInventariosEnabled] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [activeInventario, setActiveInventario] = useState(null);
    const [selectedInventario, setSelectedInventario] = useState(null);
    const [inventarioSelectionMap, setInventarioSelectionMap] = useState({});
    const [deselectedProducts, setDeselectedProducts] = useState([]);
    const { roles, userId } = useAuth();
    const isNotAdmin = !roles.includes("Admin");

    
    useEffect(() => {
        if (visible) {
            const initialSelectionMap = {};
            const inventoriesInvolved = new Set(); // To track unique inventories
    
            selectedProducts.forEach((product) => {
                const { codigo_producto, inventarioId, cantidad } = product;
                inventoriesInvolved.add(inventarioId); // Add inventory ID to the set
                if (!initialSelectionMap[inventarioId]) {
                    initialSelectionMap[inventarioId] = [];
                }
                initialSelectionMap[inventarioId].push({ codigo_producto, cantidad });
            });
    
            setInventarioSelectionMap(initialSelectionMap);
    
            // Determine if multiple inventories are involved
            if (inventoriesInvolved.size > 1) {
                setIsMultiInventariosEnabled(true); // Enable Multi-Inventories mode
                setActiveInventario(null); // No single inventory is "active"
            } else {
                // Single inventory mode: set the first inventory as active
                setIsMultiInventariosEnabled(false);
                setActiveInventario([...inventoriesInvolved][0] || null); // Get the only inventory ID or null
            }
    
            setDeselectedProducts([]); // Reset deselected products
        }
    }, [visible, selectedProducts]);
    
    // Define the columns
const baseColumns = [
    { title: 'Código', dataIndex: 'codigo_producto', key: 'codigo_producto' },
    { title: 'Nombre', dataIndex: 'nombre_producto', key: 'nombre_producto' },
    { title: 'Unidad', dataIndex: 'unidad_medida', key: 'unidad_medida' },
];

// Add price columns only if the user is an admin
const priceColumns = [
    { title: 'Precio Costo', dataIndex: 'precio_costo', key: 'precio_costo', align: 'right' },
    { title: 'Precio Venta', dataIndex: 'precio_venta', key: 'precio_venta', align: 'right' },
];

// Merge columns conditionally
const columns = isNotAdmin ? baseColumns : [...baseColumns, ...priceColumns];

    
    const onGlobalFilterChange = (e) => setGlobalFilterValue(e.target.value);

    const toggleMultiInventarios = () => {
        if (!isMultiInventariosEnabled) {
            setIsMultiInventariosEnabled(true);
        } else {
            Modal.confirm({
                title: 'Cambiar a Modo de Inventario Único',
                content: (
                    <>
                        <p>Esta acción mantendrá solo las selecciones del inventario seleccionado. ¿Quieres continuar?</p>
                        <p><strong>Inventario Seleccionado:</strong> {selectedInventoryName}</p>
                    </>
                ),
                onOk: () => {
                    setInventarioSelectionMap((prevMap) => {
                        return { [activeInventario]: prevMap[activeInventario] || [] };
                    });
                    setIsMultiInventariosEnabled(false);
                    setDeselectedProducts([]);
                },
            });
            
        }
    };

    const handleCardClick = (inventarioId) => {
        setSelectedInventario(inventarioId);
        if (isMultiInventariosEnabled) {
            setActiveInventario(inventarioId);
        } else {
            const previousSelection = inventarioSelectionMap[activeInventario] || [];
            setInventarioSelectionMap((prevMap) => ({
                ...prevMap,
                [activeInventario]: undefined,
                [inventarioId]: previousSelection,
            }));
            setActiveInventario(inventarioId);
        }
    };

    const updateInventarioSelectionMap = (inventarioId, selectedRowKeys) => {
        const currentSelections = selectedRowKeys.map((codigo_producto) => {
            const existingProduct = (inventarioSelectionMap[inventarioId] || []).find(
                (item) => item.codigo_producto === codigo_producto
            );
            return { codigo_producto, cantidad: existingProduct ? existingProduct.cantidad : 1 };
        });

        const previouslySelected = inventarioSelectionMap[inventarioId] || [];
        const deselections = previouslySelected.filter(
            (prev) => !currentSelections.some((curr) => curr.codigo_producto === prev.codigo_producto)
        );

        setDeselectedProducts((prev) => [
            ...prev,
            ...deselections.map((item) => ({ ...item, inventarioId })),
        ]);

        setInventarioSelectionMap((prev) => ({
            ...prev,
            [inventarioId]: currentSelections,
        }));
    };

    const handleConfirmSelection = () => {
        const selectedProductsData = Object.entries(inventarioSelectionMap).flatMap(
            ([inventarioId, products]) =>
                (products || []).map((item) => {
                    const product = inventariosProductos
                        .find((inv) => inv.id_inventario === parseInt(inventarioId))
                        ?.productos.find((prod) => prod.codigo_producto === item.codigo_producto);
                    return {
                        ...product,
                        cantidad: item.cantidad,
                        inventarioId: parseInt(inventarioId),
                        inventoryName: inventarios.find((inv) => inv.id_inventario === parseInt(inventarioId))
                            ?.nombre_inventario || '',
                    };
                })
        );

        if (!isMultiInventariosEnabled) {
            const deselectedInSingleMode = selectedProducts.filter(
                (prevProduct) =>
                    !selectedProductsData.some(
                        (selectedProduct) =>
                            selectedProduct.codigo_producto === prevProduct.codigo_producto &&
                            selectedProduct.inventarioId === prevProduct.inventarioId
                    )
            );
            onSelectProduct(selectedProductsData, deselectedInSingleMode);
        } else {
            onSelectProduct(selectedProductsData, deselectedProducts);
        }

        setDeselectedProducts([]);
        onHide();
    };

    const rowSelection = {
        selectedRowKeys: (inventarioSelectionMap[activeInventario] || []).map((item) => item.codigo_producto),
        onChange: (selectedRowKeys) => updateInventarioSelectionMap(activeInventario, selectedRowKeys),
    };

    const filteredProducts = inventariosProductos
        .filter((invProd) => invProd.id_inventario === activeInventario)
        .flatMap((invProd) => invProd.productos)
        .filter((producto) =>
            Object.values(producto).some((value) =>
                value && value.toString().toLowerCase().includes(globalFilterValue.toLowerCase())
            )
        )
        .sort((a, b) => a.nombre_producto.localeCompare(b.nombre_producto));

    const selectedInventoryName =
        activeInventario !== null
            ? inventarios.find((inv) => inv.id_inventario === activeInventario)?.nombre_inventario
            : ' - ';

    return (
        <Modal
    title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>Catálogo de Productos</span>
            <Checkbox
                checked={isMultiInventariosEnabled}
                onChange={toggleMultiInventarios}
                style={{ marginRight: 100}}
            >
                Selección Múltiple Inventarios
            </Checkbox>
        </div>
    }
    visible={visible}
    onCancel={onHide}
    footer={[
        <Button key="confirm" type="primary" onClick={handleConfirmSelection}>
            Confirmar Selección
        </Button>,
        <Button key="close" onClick={onHide}>Cerrar</Button>,
    ]}
    width="80%"
>
    <Divider />

    <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        {inventarios.map((inventario) => {
            const hasSelectedProducts = inventarioSelectionMap[inventario.id_inventario]?.length > 0;
            const isHighlighted = isMultiInventariosEnabled
                ? hasSelectedProducts
                : activeInventario === inventario.id_inventario;

            return (
                <Col key={inventario.id_inventario} span={6}>
                    <Card
                        onClick={() => handleCardClick(inventario.id_inventario)}
                        hoverable
                        style={{
                            cursor: 'pointer',
                            transition: '0.3s',
                            border: selectedInventario === inventario.id_inventario 
                                ? '2px solid lightblue' 
                                : isHighlighted 
                                    ? '2px solid #1677ff' 
                                    : '',
                            backgroundColor: isHighlighted ? '#1677ff' : '#fff',
                            color: isHighlighted ? '#fff' : 'inherit',
                        }}
                        bodyStyle={{ textAlign: 'center' }}
                    >
                        {inventario.nombre_inventario}
                    </Card>
                </Col>
            );
        })}
    </Row>

    <Divider />

    <Typography.Title level={5} style={{ marginBottom: 16 }}>
        Inventario Seleccionado: {selectedInventoryName}
    </Typography.Title>

    <Input
        value={globalFilterValue}
        onChange={onGlobalFilterChange}
        placeholder="Buscar en el catálogo"
        style={{ width: '100%', marginBottom: 16 }}
    />

    <Table
        columns={isNotAdmin ? baseColumns : [...baseColumns, ...priceColumns]}
        dataSource={filteredProducts}
        rowSelection={rowSelection}
        rowKey="codigo_producto"
        pagination={{ pageSize: 5 }}
        scroll={{ y: 300 }}
        size="small"
    />
</Modal>

    );
};

export default CatalogoDialog;

