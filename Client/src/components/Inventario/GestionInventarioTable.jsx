import React from 'react';
import { Table, Button } from 'antd';
import { FileImageTwoTone } from '@ant-design/icons';
import { InputNumber } from 'primereact/inputnumber';
import PropTypes from 'prop-types';

const GestionInventarioTable = ({ data, handleInputChange, onOpenCatalogo }) => {
    const columns = [
        {
            title: 'Código Producto',
            dataIndex: 'codigo_producto',
            key: 'codigo_producto',
            responsive: ['sm'],
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
            render: (_, record) => (
                <InputNumber
                    value={record.cantidad}
                    onValueChange={(e) => handleInputChange(record.key, e.value)}
                    mode="decimal"
                    showButtons
                    min={0}
                    max={100}
                    className="custom-input-number"
                />
            ),
        },
    ];

    return (
        <div className="table-container">
            <div className="table-header">
                <Button 
                    type="primary" 
                    onClick={onOpenCatalogo} 
                    style={{ marginBottom: '10px' }}
                >
                    Ver Catálogo
                </Button>
            </div>
            <div>
                <Table
                    columns={columns}
                    dataSource={data}
                    pagination={{ position: ['bottomRight'], pageSize: 5 }}
                    scroll={{ x: 'max-content' }}
                    rowKey="id_producto"
                    className="gestion-inventario-table" // Added className
                />
            </div>
        </div>
    );
};

GestionInventarioTable.propTypes = {
    data: PropTypes.array.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    onOpenCatalogo: PropTypes.func.isRequired,
};

export default GestionInventarioTable;
