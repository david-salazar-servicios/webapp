import React, { useState } from 'react';
import { Table, Button, Input } from 'antd';
import { FileImageTwoTone, SearchOutlined } from '@ant-design/icons';
import { InputNumber } from 'primereact/inputnumber';
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
            item.id_producto.toString().includes(value) || // Filter by ID
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
        },
        {
            title: 'Nombre del Producto',
            dataIndex: 'nombre_producto',
            key: 'nombre_producto',
        },
        {
            title: 'Unidad de Medida',
            dataIndex: 'unidad_medida',
            key: 'unidad_medida',
        },
        {
            title: 'Imagen',
            dataIndex: 'imagen',
            key: 'imagen',
            render: () => <FileImageTwoTone style={{ fontSize: '24px' }} />,
        },
        {
            title: 'Cantidad',
            key: 'cantidad',
            dataIndex: 'cantidad',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
    ];

    return (
        <div className="table-container">
            <div className="table-header">
                <Input
                    placeholder="Buscar por ID, nombre o unidad de medida"
                    value={searchText}
                    onChange={(e) => handleSearch(e.target.value)}
                    style={{ marginBottom: 10, width: '300px' }}
                    prefix={<SearchOutlined />}
                />
                <Button
                    type="primary"
                    onClick={onOpenCatalogo}
                    style={{ marginBottom: '10px', marginLeft: '10px' }}
                >
                    Ver Catálogo
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredData}
                pagination={{ position: ['bottomRight'], pageSize: 5 }}
                scroll={{ x: 'max-content', y: '100%' }} // Ensures the table scrolls vertically
                rowKey="id_producto"
                className="gestion-inventario-table"
                onRow={(record) => ({
                    onClick: () => onRowSelect(record), // Set the selected product on row click
                })}
                style={{ height: '100%' }} // Ensures the table fills the available space
            />
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
