import React, { useState, useEffect } from 'react';
import { Modal, Table, Input, Button } from 'antd';
import { useGetProductosQuery } from '../../features/Productos/ProductoApiSlice';

const CatalogoDialog = ({ visible, onHide, onSelectProduct, selectedProducts }) => {
    const { data: productos = [], isLoading } = useGetProductosQuery();  
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        setSelectedRowKeys(selectedProducts.map((product) => product.codigo_producto));
    }, [selectedProducts]);

    const onGlobalFilterChange = (e) => setGlobalFilterValue(e.target.value);

    const filteredProducts = productos.filter((producto) =>
        Object.values(producto).some((value) =>
            value && value.toString().toLowerCase().includes(globalFilterValue.toLowerCase())
        )
    );

    const columns = [
        { title: 'Código', dataIndex: 'codigo_producto', key: 'codigo_producto' },
        { title: 'Nombre', dataIndex: 'nombre_producto', key: 'nombre_producto' },
        { title: 'Unidad', dataIndex: 'unidad_medida', key: 'unidad_medida' },
        { title: 'Precio Costo', dataIndex: 'precio_costo', key: 'precio_costo', align: 'right' },
        { title: 'Precio Venta', dataIndex: 'precio_venta', key: 'precio_venta', align: 'right' },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedRowKeys(selectedRowKeys);
        },
    };

    const handleConfirmSelection = () => {
        const selectedProductsData = productos.filter((producto) =>
            selectedRowKeys.includes(producto.codigo_producto)
        );
        onSelectProduct(selectedProductsData);
        onHide(); // Close the dialog only on confirmation
    };

    return (
        <Modal
            title="Catálogo de Productos"
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
            <Input
                value={globalFilterValue}
                onChange={onGlobalFilterChange}
                placeholder="Buscar en el catálogo"
                style={{ width: '100%', marginBottom: 16 }}
            />
            <Table
                columns={columns}
                dataSource={filteredProducts}
                rowSelection={{ type: 'checkbox', ...rowSelection }}
                rowKey="codigo_producto"
                pagination={{ pageSize: 5 }}
                loading={isLoading}
                scroll={{ y: 300 }}
                size="small"
            />
        </Modal>
    );
};

export default CatalogoDialog;
