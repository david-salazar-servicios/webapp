import React, { useState } from 'react';
import { useGetServicesQuery } from '../../features/services/ServicesApiSlice';
import { useGetCategoriasQuery } from '../../features/categorias/CategoriasApiSlice';
import { useDeleteServiceMutation } from '../../features/services/ServicesApiSlice';
import { Table, Popconfirm, message, Button, Space, Card } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap styles

const ServicesTable = () => {
    const { data: servicesData, isLoading: isLoadingServices, error: errorServices } = useGetServicesQuery();
    const { data: categoriasData } = useGetCategoriasQuery();
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();
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
                await deleteService(selectedRowKeys[0]).unwrap();
                message.success('Servicio eliminado correctamente');
                setSelectedRowKeys([]); // Clear selection after deletion
            } catch (error) {
                message.error('Error al eliminar el servicio');
            }
        } else {
            message.warning('Selecciona una fila para eliminar.');
        }
    };

    const getCategoriaNames = (id_servicio) => {
        if (!categoriasData || !servicesData) return 'Categoría no encontrada';

        const serviceCategorias = servicesData?.categorias?.filter(cat => cat.id_servicio === id_servicio);
        if (serviceCategorias?.length > 0) {
            const categoryNames = serviceCategorias
                .map(cat => categoriasData.find(c => c.id_categoria === cat.id_categoria)?.nombre)
                .filter(Boolean);
            return categoryNames.length > 0 ? categoryNames.join(', ') : 'Categoría no encontrada';
        }
        return 'Categoría no encontrada';
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
        {
            title: 'Categorías',
            dataIndex: 'id_servicio',
            key: 'id_categoria',
            render: (id_servicio) => <span>{getCategoriaNames(id_servicio)}</span>,
        },
    ];

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
            if (selectedKeys.length > 1) {
                // Allow only the last selected key
                setSelectedRowKeys([selectedKeys[selectedKeys.length - 1]]);
            } else {
                setSelectedRowKeys(selectedKeys);
            }
        },
        columnWidth: 40, // Optional: adjust checkbox width
        hideSelectAll: true, // Hide the header checkbox
    };

    if (isLoadingServices) return <div className="text-center mt-4">Cargando servicios...</div>;
    if (errorServices) return <div className="text-center mt-4 text-danger">Error al cargar los servicios</div>;

    return (
        <div className="container mt-4">
            <div className="row mb-3 align-items-center">
                <div className="col-md-6 col-12 mb-3 mb-md-0">
                    <h4 className="text-primary">Gestión de Servicios</h4>
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
                        dataSource={servicesData?.servicios}
                        rowKey="id_servicio"
                        rowSelection={rowSelection}
                        pagination={{ pageSize: 5 }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default ServicesTable;
