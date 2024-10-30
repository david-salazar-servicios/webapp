import React, { useState } from 'react';
import { Table, Button, Input } from 'antd';
import { FileImageTwoTone, SearchOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';

const GestionInventarioTable = ({
    data,
    handleInputChange,
    onOpenCatalogo,
    onRowSelect,
}) => {
    const [searchText, setSearchText] = useState('');
    const [filteredData, setFilteredData] = useState(data);

    const handleSearch = (value) => {
        setSearchText(value);

        const filtered = data.filter((item) =>
            item.id_producto.toString().includes(value) ||
            item.nombre_producto.toLowerCase().includes(value.toLowerCase()) ||
            item.unidad_medida.toLowerCase().includes(value.toLowerCase())
        );

        setFilteredData(filtered);
    };

    const columns = [
        {
            title: 'Código Producto',
            dataIndex: 'codigo_producto',
            key: 'codigo_producto',
            width: 120,
            fixed: 'left',
        },
        {
            title: 'Nombre del Producto',
            dataIndex: 'nombre_producto',
            key: 'nombre_producto',
            width: 150,
        },
        {
            title: 'Unidad de Medida',
            dataIndex: 'unidad_medida',
            key: 'unidad_medida',
            width: 120,
        },
        {
            title: 'Cantidad Existente',
            key: 'cantidad',
            dataIndex: 'cantidad',
            width: 150,
        },
        {
            title: 'Cantidad Recomendada',
            dataIndex: 'status',
            key: 'status',
            width: 150,
        },
        {
            title: 'Precio Compra',
            dataIndex: 'status',
            key: 'status',
            width: 150,
        },
        {
            title: 'Precio Venta',
            dataIndex: 'status',
            key: 'status',
            width: 150,
        },
        {
            title: 'Imagen',
            dataIndex: 'imagen',
            key: 'imagen',
            render: () => <FileImageTwoTone style={{ fontSize: '24px' }} />,
            width: 70,
        },
    ];

    return (
        <div
            className="table-container"
            style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%', // Full height to manage scroll
                border: '1px solid #f0f0f0',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: '#fff',
            }}
        >
            <div
                className="table-header"
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px',
                    borderBottom: '1px solid #f0f0f0',
                    backgroundColor: '#fff',
                    position: 'sticky',
                    top: 0,
                    zIndex: 2, // Ensure it stays on top
                }}
            >
                <Input
                    placeholder="Buscar por ID, nombre o unidad de medida"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ width: '300px' }}
                    prefix={<SearchOutlined />}
                />
                <Button
                    type="primary"
                    onClick={onOpenCatalogo}
                    style={{ marginLeft: '10px' }}
                >
                    Ver Catálogo
                </Button>
            </div>
            <div style={{ flex: 1, overflow: 'auto' }}>
                <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{ position: ['bottomRight'], pageSize: 5 }}
                    scroll={{ y: 400 }} // Make only the rows scrollable
                    rowKey="id_producto"
                    className="gestion-inventario-table"
                    onRow={(record) => ({
                        onClick: () => onRowSelect(record),
                    })}
                    sticky // Ensure header sticks during scroll
                />
            </div>
        </div>
    );
};

GestionInventarioTable.propTypes = {
    data: PropTypes.array.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    onOpenCatalogo: PropTypes.func.isRequired,
    onRowSelect: PropTypes.func.isRequired,
};

export default GestionInventarioTable;
