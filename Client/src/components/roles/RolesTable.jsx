import React, { useState } from 'react';
import { useGetRolesQuery, useDeleteRolMutation } from '../../features/roles/RolesApiSlice';
import { Table, Popconfirm, message, Button, Space, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const RolesTable = () => {
    const { data: roles, isLoading: isLoadingRoles, error: errorRoles } = useGetRolesQuery();
    const [deleteRol, { isLoading: isDeleting }] = useDeleteRolMutation();
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
                await deleteRol(selectedRowKeys[0]).unwrap();
                message.success('Rol eliminado correctamente');
                setSelectedRowKeys([]);
            } catch (error) {
                message.error('Error al eliminar el rol');
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
        {
            title: 'Descripción',
            dataIndex: 'descripcion',
            key: 'descripcion',
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

    if (isLoadingRoles) return <div className="text-start mt-4">Cargando roles...</div>;
    if (errorRoles) return <div className="text-start mt-4 text-danger">Error al cargar los roles</div>;

    return (
        <div className="container mt-4">
            <div className="row mb-3 align-items-center">
                <div className="col-md-6 col-12 mb-3 mb-md-0">
                    <h4 className="text-primary">Gestión de Roles</h4>
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
                        dataSource={roles}
                        rowKey="id_rol"
                        rowSelection={rowSelection}
                        pagination={{ pageSize: 5 }}
                        style={{
                            margin: 0,
                            textAlign: 'left',
                        }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default RolesTable;
