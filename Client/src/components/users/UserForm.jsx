import React from 'react';
import { Form, Input, Button, Card, Row, Col, message, Select } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
    useGetUserByIdQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useAssignRoleToUserMutation,
    useGetUserRoleQuery,
    useUpdateUserRoleMutation
} from '../../features/users/UsersApiSlice';
import { useGetRolesQuery } from '../../features/roles/RolesApiSlice';
import image from '../../assets/images/Logo-removebg-preview.png';

const UserForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const usuarioId = searchParams.get('editar');

    const [form] = Form.useForm();
    const isEditMode = Boolean(usuarioId);

    const { data: usuario, isLoading: isLoadingUsuario } = useGetUserByIdQuery(usuarioId, {
        skip: !isEditMode,
    });
    const { data: userRole, isLoading: isLoadingUserRole } = useGetUserRoleQuery(usuarioId, {
        skip: !isEditMode,
    });
    const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();

    const [assignRole, { isLoading: isAssigning }] = useAssignRoleToUserMutation();
    const { data: roles, isLoading: isLoadingRoles } = useGetRolesQuery();
    const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

    const [formChanged, setFormChanged] = useState(false);

    useEffect(() => {
        if (isEditMode && usuario) {
            // Comprueba si userRole es un array antes de intentar mapearlo
            const roleIds = Array.isArray(userRole) ? userRole.map(role => role.id_rol) : [];
            form.setFieldsValue({
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                correo_electronico: usuario.correo_electronico,
                telefono:usuario.telefono,
                contrasena: usuario.contrasena,
                roles: roleIds,
            });
        } else {
            form.resetFields();
        }
    }, [usuario, userRole, form, isEditMode]);



    const handleCancelEdit = () => {
        form.resetFields();
        navigate('/mantenimiento/perfiles');
    };

    const onFinish = async (values) => {
        if (!formChanged) {
            message.info('No se han realizado cambios.');
            return;
        }
        try {
            if (isEditMode) {
                const updatedUserResponse = await updateUser({ id: usuarioId, ...values }).unwrap();
                if (Array.isArray(values.roles)) {
                    // Aquí puedes decidir entre actualizar todos los roles juntos 
                    // o borrar y volver a asignar si eso se ajusta mejor a tu API.
                    await updateUserRole({ id_usuario: usuarioId, roles: values.roles }).unwrap();
                }
                message.success('Usuario y roles actualizados correctamente');
            } else {
                const newUserResponse = await createUser(values).unwrap();
                if (Array.isArray(values.roles)) {
                    for (const id_rol of values.roles) {
                        await assignRole({ id_usuario: newUserResponse.id_usuario, id_rol }).unwrap();
                    }
                }
                message.success('Usuario creado y roles asignados correctamente');
            }
            form.resetFields();
            setFormChanged(false);
            navigate('/mantenimiento/perfiles');
        } catch (error) {
            console.error('Error al procesar el usuario:', error);
            message.error('Error al procesar el usuario');
        }
    };


    if (isLoadingUsuario) return <p>Cargando usuario...</p>;

    return (
        <Row gutter={[16, 16]} style={{ marginTop: "30px" }}>
            <Col xs={24} sm={24} md={12} lg={13}>
                <Card title="Formulario de Usuarios" bordered={false} style={{
                    maxWidth: '800px', marginTop: "30px",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    borderRadius: "5px",
                }}>
                    <Form
                        form={form}
                        name="usuarios_form"
                        onFinish={onFinish}
                        onValuesChange={() => setFormChanged(true)}
                        initialValues={{}} // Initial values go here
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Form.Item
                            name="nombre"
                            label="Nombre"
                            rules={[{ required: true, message: 'Por favor ingresa el nombre del usuario!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="apellido"
                            label="Apellido"
                            rules={[{ required: true, message: 'Por favor ingresa el apellido del usuario!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="correo_electronico"
                            label="Correo Electrónico"
                            rules={[{ required: true, type: 'email', message: 'Por favor ingresa un correo electrónico válido!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="telefono"
                            label="Número Telefónico"
                            rules={[{ required: true, message: 'Por favor ingresa un número telefónico!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="contrasena"
                            label="Contraseña"
                            rules={[{ required: true, message: 'Por favor ingresa una contraseña!' }]}
                        >
                            <Input.Password />
                        </Form.Item>
                        <Form.Item
                            name="roles"
                            label="Roles"
                            rules={[{ required: true, message: 'Por favor selecciona al menos un rol!' }]}
                        >
                            <Select
                                mode="multiple"
                                placeholder="Selecciona roles"
                                style={{ width: '100%' }}
                                loading={isLoadingRoles}
                            >
                                {roles?.map((rol) => (
                                    <Select.Option key={rol.id_rol} value={rol.id_rol}>{rol.nombre}</Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                            <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                                {isEditMode ? 'Actualizar Usuario' : 'Agregar Usuario'}
                            </Button>
                            {isEditMode && (
                                <Button
                                    style={{ marginLeft: '10px' }}
                                    onClick={handleCancelEdit}>
                                    Cancelar Edición
                                </Button>
                            )}
                        </Form.Item>
                    </Form>
                </Card>
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}> {/* Tamaño de columna para la imagen */}
                <div className="text-center">
                    <img src={image} alt="logo" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
            </Col>
        </Row>
    );
};

export default UserForm;
