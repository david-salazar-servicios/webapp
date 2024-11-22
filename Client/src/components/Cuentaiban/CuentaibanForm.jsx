import React, { useState } from 'react';
import { ConfigProvider, Form, Input, Button, Card, Row, Col, message, Table, Space, Popconfirm, Select } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import {
    useCreateCuentaIbanMutation,
    useUpdateCuentaIbanMutation,
    useDeleteCuentaIbanMutation,
    useGetCuentasIbanQuery,
} from '../../features/Cuentaiban/CuentaibanApiSlice';
import image from '../../assets/images/Logo-removebg-preview.png';
const { Option } = Select;

const CuentaIbanForm = () => {
    const { data: cuentasIban = [], isLoading, error } = useGetCuentasIbanQuery();
    const [createCuentaIban] = useCreateCuentaIbanMutation();
    const [updateCuentaIban] = useUpdateCuentaIbanMutation();
    const [deleteCuentaIban] = useDeleteCuentaIbanMutation();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);
    const [currentCuentaIbanId, setCurrentCuentaIbanId] = useState(null);

    const navigate = useNavigate();

    const rowSelection = {
        selectedRowKeys,
        onChange: (selectedKeys) => {
            if (selectedKeys.length > 1) {
                setSelectedRowKeys([selectedKeys[selectedKeys.length - 1]]);
            } else {
                setSelectedRowKeys(selectedKeys);
            }
        },
        columnWidth: 40,
        hideSelectAll: true,
    };

    const handleEdit = () => {
        if (selectedRowKeys.length === 1) {
            const record = cuentasIban.find((item) => item.id_cuenta === selectedRowKeys[0]);
            form.setFieldsValue(record);
            setEditMode(true);
            setCurrentCuentaIbanId(record.id_cuenta);
            setSelectedRowKeys([]);
        } else {
            message.warning('Selecciona una fila para editar.');
        }
    };

    const handleDelete = async () => {
        if (selectedRowKeys.length === 1) {
            try {
                await deleteCuentaIban(selectedRowKeys[0]).unwrap();
                message.success('Cuenta IBAN eliminada correctamente');
                setSelectedRowKeys([]);
            } catch (error) {
                message.error('Error al eliminar la cuenta IBAN');
            }
        } else {
            message.warning('Selecciona una fila para eliminar.');
        }
    };

    const onFinish = async (values) => {
        try {
            if (editMode) {
                await updateCuentaIban({ id_cuenta: currentCuentaIbanId, ...values }).unwrap();
                message.success('Cuenta IBAN actualizada correctamente');
            } else {
                await createCuentaIban(values).unwrap();
                message.success('Cuenta IBAN creada correctamente');
            }
            form.resetFields();
            setEditMode(false);
            setCurrentCuentaIbanId(null);
        } catch (error) {
            console.error('Error al procesar la cuenta IBAN:', error);
            message.error('Error al procesar la cuenta IBAN');
        }
    };

    const handleCancelEdit = () => {
        form.resetFields();
        setEditMode(false);
        setCurrentCuentaIbanId(null);
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
    ];

    if (isLoading) return <div className="text-start mt-4">Cargando cuentas IBAN...</div>;
    if (error) return <div className="text-start mt-4 text-danger">Error al cargar las cuentas IBAN</div>;

    return (
        <div className="container mt-4">
            {/* Formulario */}
            <Row gutter={[16, 16]} style={{ paddingBottom: '20px' }}>
                <Col xs={24} sm={24} md={12} lg={12}>
                    <Card
                        bordered={false}
                        className="shadow-sm rounded"
                        style={{
                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.1)',
                            borderRadius: '8px',
                        }}
                        title={editMode ? 'Editar Cuenta IBAN' : 'Crear Cuenta IBAN'}
                    >
                        <Form
                            form={form}
                            name="cuenta_iban_form"
                            onFinish={onFinish}
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
                                {editMode && (
                                    <Button
                                        style={{ marginLeft: '10px' }}
                                        onClick={handleCancelEdit}
                                    >
                                        Cancelar
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

            {/* Tabla */}
            <div className="row mb-3 align-items-center">
                <div className="col-md-6 col-12 mb-3 mb-md-0">
                    <h4 className="text-primary">Gestión de Cuentas IBAN</h4>
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
                        dataSource={cuentasIban}
                        rowKey="id_cuenta"
                        rowSelection={rowSelection}
                        pagination={{ pageSize: 5 }}
                        style={{
                            margin: 0,
                            textAlign: 'left',
                        }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default CuentaIbanForm;
