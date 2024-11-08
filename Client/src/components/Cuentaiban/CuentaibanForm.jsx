import React, { useState } from 'react';
import { Form, Input, Button, Card, Row, Col, message, Table, Space, Popconfirm, Select } from 'antd';
import {
    useCreateCuentaIbanMutation,
    useUpdateCuentaIbanMutation,
    useDeleteCuentaIbanMutation,
    useGetCuentasIbanQuery,
} from '../../features/Cuentaiban/CuentaibanApiSlice';
import image from '../../assets/images/Logo-removebg-preview.png';

const { Option } = Select;

const CuentaIbanForm = () => {
    const [form] = Form.useForm();
    const [formChanged, setFormChanged] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [currentCuentaIbanId, setCurrentCuentaIbanId] = useState(null);

    // API hooks for CRUD operations
    const { data: cuentasIban = [], isLoading } = useGetCuentasIbanQuery();
    const [createCuentaIban] = useCreateCuentaIbanMutation();
    const [updateCuentaIban] = useUpdateCuentaIbanMutation();
    const [deleteCuentaIban] = useDeleteCuentaIbanMutation();

    const onFinish = async (values) => {
        try {
            if (editMode) {
                // Update existing cuenta iban
                await updateCuentaIban({ id_cuenta: currentCuentaIbanId, ...values });
                message.success('Cuenta IBAN actualizada correctamente');
            } else {
                // Create new cuenta iban
                await createCuentaIban(values);
                message.success('Cuenta IBAN guardada correctamente');
            }
            form.resetFields();
            setFormChanged(false);
            setEditMode(false);
            setCurrentCuentaIbanId(null);
        } catch (error) {
            console.error('Error al procesar la cuenta IBAN:', error);
            message.error('Error al procesar la cuenta IBAN');
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setEditMode(false);
        setCurrentCuentaIbanId(null);
    };

    const handleEdit = (record) => {
        form.setFieldsValue(record);
        setEditMode(true);
        setCurrentCuentaIbanId(record.id_cuenta); // id_cuenta is used as the unique identifier
    };

    const handleDelete = async (id) => {
        try {
            await deleteCuentaIban(id);
            message.success('Cuenta IBAN eliminada correctamente');
        } catch (error) {
            console.error('Error al eliminar la cuenta IBAN:', error);
            message.error('Error al eliminar la cuenta IBAN');
        }
    };

    const columns = [
        {
            title: 'Cuenta IBAN',
            dataIndex: 'id_iban',
            key: 'id_iban',
        },
        {
            title: 'Banco',
            dataIndex: 'tipobanco',
            key: 'tipobanco',
        },
        {
            title: 'Moneda',
            dataIndex: 'moneda',
            key: 'moneda',
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="link" onClick={() => handleEdit(record)}>Editar</Button>
                    <Popconfirm
                        title="¿Seguro que deseas eliminar esta cuenta IBAN?"
                        onConfirm={() => handleDelete(record.id_cuenta)}
                    >
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
                    title={editMode ? 'Editar Cuenta IBAN' : 'Formulario de Cuenta IBAN'}
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
                        name="cuenta_iban_form"
                        onFinish={onFinish}
                        onValuesChange={() => setFormChanged(true)}
                        initialValues={{}} 
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Form.Item
                            name="id_iban"
                            label="Cuenta IBAN"
                            rules={[{ required: true, message: 'Por favor ingresa el ID IBAN' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="tipobanco"
                            label="Banco"
                            rules={[{ required: true, message: 'Por favor selecciona el banco' }]}
                        >
                            <Select placeholder="Seleccione el banco">
                                <Option value="BANCO DE COSTA RICA">BANCO DE COSTA RICA</Option>
                                <Option value="BANCO NACIONAL">BANCO NACIONAL</Option>
                                <Option value="BAC">BAC</Option>
                                <Option value="SCOTIABANK">SCOTIABANK</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="moneda"
                            label="Moneda"
                            rules={[{ required: true, message: 'Por favor selecciona la moneda' }]}
                        >
                            <Select placeholder="Seleccione la moneda">
                                <Option value="COLONES">COLONES</Option>
                                <Option value="DÓLAR">DÓLAR</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                            <Button type="primary" htmlType="submit">
                                {editMode ? 'Actualizar Cuenta IBAN' : 'Guardar Cuenta IBAN'}
                            </Button>
                            <Button style={{ marginLeft: '10px' }} onClick={handleCancel}>
                                Cancelar
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
                <Table
                    columns={columns}
                    dataSource={cuentasIban}
                    rowKey="id_cuenta" // Set row key to id_cuenta
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

export default CuentaIbanForm;
