import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, message, Table, Popconfirm, Space } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
    useGetInventariosQuery,
    useCreateInventarioMutation,
    useUpdateInventarioMutation,
    useDeleteInventarioMutation,
} from '../../features/Inventario/InventarioApiSlice';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import image from '../../assets/images/Logo-removebg-preview.png';

const InventarioForm = () => {
    const { data: inventarios, isLoading: isLoadingInventarios, error: errorInventarios } = useGetInventariosQuery();
    const [createInventario] = useCreateInventarioMutation();
    const [updateInventario] = useUpdateInventarioMutation();
    const [deleteInventario] = useDeleteInventarioMutation();

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [form] = Form.useForm();
    const [editMode, setEditMode] = useState(false);
    const [currentInventarioId, setCurrentInventarioId] = useState(null);
    const navigate = useNavigate();

    // Manejo de selección de filas
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
            const record = inventarios.find((item) => item.id_inventario === selectedRowKeys[0]);
            form.setFieldsValue(record);
            setEditMode(true);
            setCurrentInventarioId(record.id_inventario);
            setSelectedRowKeys([]);
        } else {
            message.warning('Selecciona una fila para editar.');
        }
    };

    const handleDelete = async () => {
        if (selectedRowKeys.length === 1) {
            try {
                await deleteInventario(selectedRowKeys[0]).unwrap();
                message.success('Inventario eliminado correctamente');
                setSelectedRowKeys([]);
            } catch (error) {
                message.error('Error al eliminar el inventario');
            }
        } else {
            message.warning('Selecciona una fila para eliminar.');
        }
    };

    const onFinish = async (values) => {
        try {
            if (editMode) {
                await updateInventario({ id: currentInventarioId, ...values }).unwrap();
                message.success('Inventario actualizado correctamente');
            } else {
                await createInventario(values).unwrap();
                message.success('Inventario creado correctamente');
            }
            form.resetFields();
            setEditMode(false);
            setCurrentInventarioId(null);
        } catch (error) {
            console.error('Error al procesar el inventario:', error);
            message.error('Error al procesar el inventario');
        }
    };

    const handleCancelEdit = () => {
        form.resetFields();
        setEditMode(false);
        setCurrentInventarioId(null);
    };

    const columns = [
        {
            title: 'Nombre del Inventario',
            dataIndex: 'nombre_inventario',
            key: 'nombre_inventario',
        },
    ];

    if (isLoadingInventarios) return <div className="text-start mt-4">Cargando inventarios...</div>;
    if (errorInventarios) return <div className="text-start mt-4 text-danger">Error al cargar los inventarios</div>;

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
                        title={editMode ? 'Editar Inventario' : 'Crear Inventario'}
                    >
                        <Form
                            form={form}
                            name="inventario_form"
                            onFinish={onFinish}
                            initialValues={{}}
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
                    <h4 className="text-primary">Gestión de Inventarios</h4>
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
                        dataSource={inventarios}
                        rowKey="id_inventario"
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

export default InventarioForm;
