import React from 'react';
import { useGetServicesQuery } from '../../features/services/ServicesApiSlice';
import { useGetCategoriasQuery } from '../../features/categorias/CategoriasApiSlice';
import { useDeleteServiceMutation } from '../../features/services/ServicesApiSlice';
import { Table, Button, Col, Popconfirm, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const ServicesTable = () => {
    const { data: services, isLoading: isLoadingServices, error: errorServices } = useGetServicesQuery();
    const { data: categorias } = useGetCategoriasQuery();
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

    const navigate = useNavigate();
    const handleEdit = (id_servicio) => {
        // Actualiza la URL sin navegar realmente
        navigate(`?editar=${id_servicio}`, { replace: true });
    };
    const handleDelete = async (id) => {
        try {
            await deleteService(id).unwrap();
            message.success('Servicio eliminado correctamente');

        } catch (error) {
            message.error('Error al eliminar el servicio');
        }
    };

    // Mapea los IDs de categoría a nombres de categorías
    const getCategoriaName = (id_categoria) => {
        const categoria = categorias?.find(cat => cat.id_categoria === id_categoria);
        return categoria ? categoria.nombre : 'Desconocido';
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
            responsive: ['md'], // La columna solo se muestra en pantallas medianas y superiores
        },
        {
            title: 'Categoría',
            dataIndex: 'id_categoria',
            key: 'id_categoria',
            render: id_categoria => <span>{getCategoriaName(id_categoria)}</span>,
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Row gutter={[8, 8]} justify="start">
                    <Col>
                        <Button onClick={() => handleEdit(record.id_servicio)}>Editar</Button>
                    </Col>
                    <Col>
                        <Popconfirm title="¿Estás seguro de querer eliminar?" onConfirm={() => handleDelete(record.id_servicio)}>
                            <Button loading={isDeleting}>Eliminar</Button>
                        </Popconfirm>
                    </Col>
                </Row>
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl']
        },
    ];

    if (isLoadingServices) return <div>Cargando servicios...</div>;
    if (errorServices) return <div>Error al cargar los servicios</div>;

    return (
        
        <Row justify="center">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Table
                    columns={columns}
                    dataSource={services}
                    rowKey="id_servicio"
                    style={{
                        marginTop: "30px",
                        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                        borderRadius: "5px",
                    }}
                />
            </Col>
        </Row>
    );

};

export default ServicesTable;
