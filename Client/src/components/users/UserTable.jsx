import React from 'react';
import { useGetUsersQuery, useDeleteUserMutation } from '../../features/users/UsersApiSlice';
import { Table, Button, Col, Popconfirm, Row } from 'antd';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

const UserTable = () => {
    const { data: usuarios, isLoading: isLoadingUsuarios, error: errorUsuarios } = useGetUsersQuery();
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
    const navigate = useNavigate();

    const handleEdit = (id_usuario) => {
        navigate(`?editar=${id_usuario}`, { replace: true });
    };

    const handleDelete = async (id) => {
        try {
            await deleteUser(id).unwrap();
            message.success('Usuario eliminado correctamente');
        } catch (error) {
            message.error('Error al eliminar el usuario');
        }
    };

    const columns = [
        {
            title: 'Nombre',
            dataIndex: 'nombre',
            key: 'nombre',
        },
        {
            title: 'Apellido',
            dataIndex: 'apellido',
            key: 'apellido',
        },
        {
            title: 'Correo Electrónico',
            dataIndex: 'correo_electronico',
            key: 'correo_electronico',
        },
        {
            title: 'Número Telefónico',
            dataIndex: 'telefono',
            key: 'telefono',
        },
        {
            title: 'Acciones',
            key: 'acciones',
            render: (_, record) => (
                <Row gutter={[8, 8]} justify="start">
                    <Col>
                        <Button onClick={() => handleEdit(record.id_usuario)}>Editar</Button>
                    </Col>
                    <Col>
                        <Popconfirm
                            title="¿Estás seguro de querer eliminar?"
                            onConfirm={() => handleDelete(record.id_usuario)}
                        >
                            <Button loading={isDeleting}>Eliminar</Button>
                        </Popconfirm>
                    </Col>
                </Row>
            ),
            responsive: ['xs', 'sm', 'md', 'lg', 'xl'],
        },
    ];

    if (isLoadingUsuarios) return <div>Cargando usuarios...</div>;
    if (errorUsuarios) return <div>Error al cargar los usuarios</div>;

    return (
        <Row justify="center">
            <Col xs={24}>
                <div
                    style={{
                        overflowX: 'auto', // Permitir scroll horizontal
                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                        borderRadius: '5px',
                        marginTop: '30px',
                        backgroundColor: '#fff', // Fondo blanco
                        padding: '16px', // Espaciado interno
                    }}
                >
                    <Table
                        columns={columns}
                        dataSource={usuarios}
                        rowKey="id_usuario"
                        pagination={{ position: ['bottomRight'], pageSize: 5 }}
                        scroll={{ x: 'max-content' }} // Habilitar scroll horizontal
                    />
                </div>
            </Col>
        </Row>
    );
};

export default UserTable;
