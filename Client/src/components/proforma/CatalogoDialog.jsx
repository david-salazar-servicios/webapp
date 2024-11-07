import React, { useState, useEffect } from 'react';
import { Modal, Table, Input, Button } from 'antd';
import { useGetProductosQuery } from '../../features/Productos/ProductoApiSlice';

const CatalogoDialog = ({ visible, onHide, onSelectProduct }) => {
    const { data: productos = [], isLoading } = useGetProductosQuery();  
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [columnFilters, setColumnFilters] = useState({
        codigo_producto: '',
        nombre_producto: '',
        unidad_medida: '',
    });

    useEffect(() => {
        console.log("Productos data:", productos);
        console.log("Loading status:", isLoading);
        console.log("Dialog visibility:", visible);
    }, [productos, isLoading, visible]);

    const onGlobalFilterChange = (e) => {
        setGlobalFilterValue(e.target.value);
    };

    const onColumnFilterChange = (e, field) => {
        setColumnFilters((prevFilters) => ({
            ...prevFilters,
            [field]: e.target.value,
        }));
    };

    const filteredProducts = productos.filter((producto) =>
        // Apply global filter across all fields, handling null or undefined values safely
        (Object.values(producto).some((value) =>
            value && value.toString().toLowerCase().includes(globalFilterValue.toLowerCase())
        )) &&
        // Apply individual column filters, handling null or undefined values safely
        Object.keys(columnFilters).every((field) =>
            producto[field] && producto[field].toString().toLowerCase().includes(columnFilters[field].toLowerCase())
        )
    );

    const columns = [
        {
            title: 'Código',
            dataIndex: 'codigo_producto',
            key: 'codigo_producto',
            filterDropdown: () => (
                <Input
                    value={columnFilters.codigo_producto}
                    onChange={(e) => onColumnFilterChange(e, 'codigo_producto')}
                    placeholder="Buscar por código"
                    style={{ marginBottom: 8, display: 'block' }}
                />
            ),
            filteredValue: columnFilters.codigo_producto ? [columnFilters.codigo_producto] : null,
        },
        {
            title: 'Nombre',
            dataIndex: 'nombre_producto',
            key: 'nombre_producto',
            filterDropdown: () => (
                <Input
                    value={columnFilters.nombre_producto}
                    onChange={(e) => onColumnFilterChange(e, 'nombre_producto')}
                    placeholder="Buscar por nombre"
                    style={{ marginBottom: 8, display: 'block' }}
                />
            ),
            filteredValue: columnFilters.nombre_producto ? [columnFilters.nombre_producto] : null,
        },
        {
            title: 'Unidad',
            dataIndex: 'unidad_medida',
            key: 'unidad_medida',
            filterDropdown: () => (
                <Input
                    value={columnFilters.unidad_medida}
                    onChange={(e) => onColumnFilterChange(e, 'unidad_medida')}
                    placeholder="Buscar por unidad"
                    style={{ marginBottom: 8, display: 'block' }}
                />
            ),
            filteredValue: columnFilters.unidad_medida ? [columnFilters.unidad_medida] : null,
        },
        {
            title: 'Precio Costo',
            dataIndex: 'precio_costo',
            key: 'precio_costo',
            align: 'right',
        },
        {
            title: 'Precio Venta',
            dataIndex: 'precio_venta',
            key: 'precio_venta',
            align: 'right',
        },
    ];

    const rowSelection = {
        selectedRowKeys: selectedProducts.map((product) => product.codigo_producto),
        onChange: (selectedRowKeys, selectedRows) => {
            setSelectedProducts(selectedRows);
        },
    };

    return (
        <Modal
            title="Catálogo de Productos"
            visible={visible}
            onCancel={onHide}
            footer={[
                <Button key="select" type="primary" onClick={() => onSelectProduct(selectedProducts)} disabled={!selectedProducts.length}>
                    Seleccionar
                </Button>,
                <Button key="close" onClick={onHide}>
                    Cerrar
                </Button>,
            ]}
            width="80%"
        >
            <div style={{ marginBottom: 16 }}>
                <Input
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Buscar en el catálogo"
                    style={{ width: '100%' }}
                />
            </div>

            <Table
                columns={columns}
                dataSource={filteredProducts}
                rowSelection={{
                    type: 'checkbox',
                    ...rowSelection,
                }}
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
