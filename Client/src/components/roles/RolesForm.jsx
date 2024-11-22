import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Card, Row, Col, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetRolByIdQuery, useCreateRolMutation, useUpdateRolMutation } from '../../features/roles/RolesApiSlice';
import image from '../../assets/images/Logo-removebg-preview.png';

const RolesForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const rolId = searchParams.get('editar');

    const [form] = Form.useForm();
    const isEditMode = Boolean(rolId);

    const { data: rol, isLoading: isLoadingRol } = useGetRolByIdQuery(rolId, {
        skip: !isEditMode,
    });

    const [createRol, { isLoading: isCreating }] = useCreateRolMutation();
    const [updateRol, { isLoading: isUpdating }] = useUpdateRolMutation();

    const [formChanged, setFormChanged] = useState(false);

    useEffect(() => {
        if (isEditMode && rol) {
            form.setFieldsValue({
                nombre: rol.nombre,
                descripcion: rol.descripcion,
            });
        } else {
            form.resetFields();
        }
    }, [rol, form, isEditMode]);

    const handleCancelEdit = () => {
        form.resetFields();
        navigate('/mantenimiento/roles');
    };

    const onFinish = async (values) => {
        if (isEditMode && !formChanged) {
            message.info('No se han realizado cambios.');
            return;
        }
        try {
            if (isEditMode) {
                await updateRol({ id: rolId, ...values }).unwrap();
                message.success('Rol actualizado correctamente');
            } else {
                await createRol(values).unwrap();
                message.success('Rol creado correctamente');
            }
            form.resetFields();
            setFormChanged(false);
            navigate('/mantenimiento/roles');
        } catch (error) {
            console.error('Error al procesar el rol:', error);
            message.error('Error al procesar el rol');
        }
    };

    if (isLoadingRol) return <div className="text-center mt-4">Cargando rol...</div>;

    return (
        <div className="container mt-4">
            <Row gutter={[16, 16]} style={{ paddingTop: '30px' }}>
                <Col xs={24} sm={24} md={12} lg={13}>
                    <Card
                        title="Formulario de Roles"
                        bordered={false}
                        style={{
                            maxWidth: '800px',
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                            borderRadius: '5px',
                        }}
                    >
                        <Form
                            form={form}
                            name="roles_form"
                            onFinish={onFinish}
                            onValuesChange={() => setFormChanged(true)}
                            initialValues={{}}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            <Form.Item
                                name="nombre"
                                label="Nombre del Rol"
                                rules={[{ required: true, message: 'Por favor ingresa el nombre del rol!' }]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item
                                name="descripcion"
                                label="Descripción"
                                rules={[{ required: true, message: 'Por favor ingresa una descripción para el rol!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                                <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                                    {isEditMode ? 'Actualizar Rol' : 'Agregar Rol'}
                                </Button>
                                {isEditMode && (
                                    <Button
                                        style={{ marginLeft: '10px' }}
                                        onClick={handleCancelEdit}
                                    >
                                        Cancelar Edición
                                    </Button>
                                )}
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div className="text-center">
                        <img src={image} alt="logo" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default RolesForm;
