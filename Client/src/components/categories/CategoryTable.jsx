import React, { useState } from 'react';
import { useGetCategoriasQuery, useDeleteCategoriaMutation } from '../../features/categorias/CategoriasApiSlice';
import { Table, Popconfirm, message, Button, Space, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const CategoryTable = () => {
    const { data: categorias, isLoading: isLoadingCategorias, error: errorCategorias } = useGetCategoriasQuery();
    const [deleteCategoria, { isLoading: isDeleting }] = useDeleteCategoriaMutation();
    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const navigate = useNavigate();

    const handleEdit = () => {
        if (selectedRowKeys.length === 1) {
            navigate(`?editar=${selectedRowKeys[0]}`, { replace: true });
            setSelectedRowKeys([]);
        } else {
            message.warning('Selecciona una fila para editar.');
        }
    };

    const handleDelete = async () => {
        if (selectedRowKeys.length === 1) {
            try {
                await deleteCategoria(selectedRowKeys[0]).unwrap();
                message.success('Categoría eliminada correctamente');
                setSelectedRowKeys([]);
            } catch (error) {
                message.error('Error al eliminar la categoría');
            }
        } else {
            message.warning('Selecciona una fila para eliminar.');
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
            if (selectedKeys.length > 1) {
                setSelectedRowKeys([selectedKeys[selectedKeys.length - 1]]);
            } else {
                setSelectedRowKeys(selectedKeys);
            }
        },
        columnWidth: 40,
        hideSelectAll: true,
    };

    if (isLoadingCategorias) return <div className="text-start mt-4">Cargando categorías...</div>;
    if (errorCategorias) return <div className="text-start mt-4 text-danger">Error al cargar las categorías</div>;

    return (
        <div className="container mt-4">
            <div className="row mb-3 align-items-center">
                <div className="col-md-6 col-12 mb-3 mb-md-0">
                    <h4 className="text-primary">Gestión de Categorías</h4>
                </div>
                <div className="col-md-6 col-12 text-md-end">
                    <Space>
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            onClick={handleEdit}
                            disabled={selectedRowKeys.length !== 1}
                            className="btn-sm"
                        >
                            Editar
                        </Button>
                        <Popconfirm
                            title="¿Estás seguro de querer eliminar?"
                            onConfirm={handleDelete}
                            okText="Sí"
                            cancelText="No"
                            disabled={selectedRowKeys.length !== 1}
                        >
                            <Button
                                type="primary"
                                danger
                                icon={<DeleteOutlined />}
                                disabled={selectedRowKeys.length !== 1}
                                className="btn-sm"
                            >
                                Eliminar
                            </Button>
                        </Popconfirm>
                    </Space>
                </div>
            </div>
            <Card
                bordered={false}
                className="shadow-sm rounded"
                style={{
                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.1)',
                    borderRadius: '8px',
                }}
            >
                <div className="table-responsive">
                    <Table
                        columns={columns}
                        dataSource={categorias}
                        rowKey="id_categoria"
                        rowSelection={rowSelection}
                        pagination={{ pageSize: 5 }}
                        style={{
                            margin: 0, // No margins
                            textAlign: 'left', // Left-aligned content
                        }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default CategoryTable;
