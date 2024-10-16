import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, message, Table, Space, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useCreateInventarioMutation, useUpdateInventarioMutation, useDeleteInventarioMutation, useGetInventariosQuery } from './../../features/Inventario/InventarioApiSlice';
import image from '../../assets/images/Logo-removebg-preview.png'; // Ensure this path is correct

const InventarioForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formChanged, setFormChanged] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentInventarioId, setCurrentInventarioId] = useState(null);

    // API hooks for CRUD operations
    const { data: inventarios = [], isLoading } = useGetInventariosQuery();
    const [createInventario] = useCreateInventarioMutation();
    const [updateInventario] = useUpdateInventarioMutation();
    const [deleteInventario] = useDeleteInventarioMutation();

    const onFinish = async (values) => {
        try {
            if (editMode) {
                // Update existing inventario
                await updateInventario({ id: currentInventarioId, ...values });
                message.success('Inventario actualizado correctamente');
            } else {
                // Create new inventario
                await createInventario(values);
                message.success('Inventario guardado correctamente');
            }
            form.resetFields();
            setFormChanged(false);
            setEditMode(false);
            setCurrentInventarioId(null);
        } catch (error) {
            console.error('Error al procesar el inventario:', error);
            message.error('Error al procesar el inventario');
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setEditMode(false);
        setCurrentInventarioId(null);
    };

    const handleEdit = (record) => {
        form.setFieldsValue(record);
        setEditMode(true);
        setCurrentInventarioId(record.id_inventario);
    };

    const handleDelete = async (id) => {
        try {
            await deleteInventario(id);
            message.success('Inventario eliminado correctamente');
        } catch (error) {
            console.error('Error al eliminar el inventario:', error);
            message.error('Error al eliminar el inventario');
        }
    };

    const columns = [
        {
            title: 'Nombre del Inventario',
            dataIndex: 'nombre_inventario',
            key: 'nombre_inventario',
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>Editar</Button>
                    <Popconfirm title="¿Seguro que deseas eliminar este inventario?" onConfirm={() => handleDelete(record.id_inventario)}>
                        <Button type="link" danger>Eliminar</Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <Row gutter={[16, 16]} style={{ marginTop: '30px' }}>
            <Col xs={24} sm={24} md={12} lg={13}>
                <Card
                    title={editMode ? 'Editar Inventario' : 'Formulario de Inventario'}
                    bordered={false}
                    style={{
                        maxWidth: '800px',
                        marginTop: '30px',
                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                        borderRadius: '5px',
                    }}
                >
                    <Form
                        form={form}
                        name="inventario_form"
                        onFinish={onFinish}
                        onValuesChange={() => setFormChanged(true)}
                        initialValues={{}} // Initial values go here
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Form.Item
                            name="nombre_inventario"
                            label="Nombre del Inventario"
                            rules={[{ required: true, message: 'Por favor ingresa el nombre del inventario!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                            <Button type="primary" htmlType="submit">
                                {editMode ? 'Actualizar Inventario' : 'Guardar Inventario'}
                            </Button>
                            <Button style={{ marginLeft: '10px' }} onClick={handleCancel}>
                                Cancelar
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Table
                    columns={columns}
                    dataSource={inventarios}
                    rowKey="id_inventario"
                    loading={isLoading}
                    pagination={false}
                    style={{ marginTop: '20px' }}
                />
            </Col>
            <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                <div className="text-center">
                    <img src={image} alt="logo" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
            </Col>
        </Row>
    );
};

export default InventarioForm;
