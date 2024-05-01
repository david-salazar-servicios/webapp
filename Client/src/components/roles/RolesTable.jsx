import React from 'react';
import { useGetRolesQuery, useDeleteRolMutation } from '../../features/roles/RolesApiSlice';
import { Table, Button, Col, Popconfirm, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const RolesTable = () => {
    const { data: roles, isLoading: isLoadingRoles, error: errorRoles } = useGetRolesQuery();
    const [deleteRol, { isLoading: isDeleting }] = useDeleteRolMutation();
    
    const navigate = useNavigate();
    
    const handleEdit = (id_rol) => {
        navigate(`?editar=${id_rol}`, { replace: true });
    };
    
    
    const handleDelete = async (id) => {
        try {
            await deleteRol(id).unwrap();
            message.success('Rol eliminado correctamente');
        } catch (error) {
            message.error('Error al eliminar el rol');
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
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Row gutter={[8, 8]} justify="start">
                    <Col>
                        <Button onClick={() => handleEdit(record.id_rol)}>Editar</Button>
                    </Col>
                    <Col>
                        <Popconfirm title="¿Estás seguro de querer eliminar?" onConfirm={() => handleDelete(record.id_rol)}>
                            <Button loading={isDeleting}>Eliminar</Button>
                        </Popconfirm>
                    </Col>
                </Row>
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl']
        },
    ];

    if (isLoadingRoles) return <div>Cargando roles...</div>;
    if (errorRoles) return <div>Error al cargar los roles</div>;

    return (
        <Row justify="center">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <Table
                    columns={columns}
                    dataSource={roles}
                    rowKey="id_rol"
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

export default RolesTable;
