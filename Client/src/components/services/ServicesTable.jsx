import React from 'react';
import { useGetServicesQuery } from '../../features/services/ServicesApiSlice';
import { useGetCategoriasQuery } from '../../features/categorias/CategoriasApiSlice';
import { useDeleteServiceMutation } from '../../features/services/ServicesApiSlice';
import { Table, Button, Col, Popconfirm, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const ServicesTable = () => {
    const { data: servicesData, isLoading: isLoadingServices, error: errorServices } = useGetServicesQuery();
    const { data: categoriasData } = useGetCategoriasQuery(); // Fetch category names
    const [deleteService, { isLoading: isDeleting }] = useDeleteServiceMutation();

    const navigate = useNavigate();

    const handleEdit = (id_servicio) => {
        // Update the URL without navigating
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

    // Function to get the category name(s) for a given service ID
    const getCategoriaNames = (id_servicio) => {
        const serviceCategorias = servicesData.categorias.filter(cat => cat.id_servicio === id_servicio);
        if (serviceCategorias.length > 0 && categoriasData) {
            const categoryNames = serviceCategorias
                .map(cat => categoriasData.find(c => c.id_categoria === cat.id_categoria)?.nombre) // Get category names
                .filter(Boolean); // Filter out undefined values if a category isn't found
            return categoryNames.length > 0 ? categoryNames.join(', ') : 'Categoría no encontrada';
        }
        return 'Categoría no encontrada';
    };

    // Define table columns
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
            responsive: ['md'], // Display only on medium screens and above
        },
        {
            title: 'Categorías',
            dataIndex: 'id_servicio',
            key: 'id_categoria',
            render: (id_servicio) => (
                <span>{getCategoriaNames(id_servicio)}</span> // Display category names
            ),
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
                    dataSource={servicesData?.servicios}
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
