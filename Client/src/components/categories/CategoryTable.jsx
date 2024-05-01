import React from 'react';
import { useGetCategoriasQuery } from '../../features/categorias/CategoriasApiSlice';
import { useDeleteCategoriaMutation } from '../../features/categorias/CategoriasApiSlice';
import { Table, Button, Col, Popconfirm, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const CategoryTable = () => {
    const { data: categorias, isLoading: isLoadingCategorias, error: errorCategorias } = useGetCategoriasQuery();
    const [deleteCategoria, { isLoading: isDeleting }] = useDeleteCategoriaMutation();
    
    const navigate = useNavigate();
    
    const handleEdit = (id_categoria) => {
        navigate(`?editar=${id_categoria}`, { replace: true });
    };
    
    
    const handleDelete = async (id) => {
        try {
            await deleteCategoria(id).unwrap();
            message.success('Categoría eliminada correctamente');
        } catch (error) {
            message.error('Error al eliminar la categoría:');
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Row gutter={[8, 8]} justify="start">
                    <Col>
                        <Button onClick={() => handleEdit(record.id_categoria)}>Editar</Button>
                    </Col>
                    <Col>
                        <Popconfirm title="¿Estás seguro de querer eliminar?" onConfirm={() => handleDelete(record.id_categoria)}>
                            <Button loading={isDeleting}>Eliminar</Button>
                        </Popconfirm>
                    </Col>
                </Row>
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl']
        },
    ];

    if (isLoadingCategorias) return <div>Cargando categorías...</div>;
    if (errorCategorias) return <div>Error al cargar las categorías</div>;

    return (
        <Row justify="center">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Table
                    columns={columns}
                    dataSource={categorias}
                    rowKey="id_categoria"
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

export default CategoryTable;
