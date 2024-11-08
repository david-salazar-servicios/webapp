import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Row, Col, message, Select, Table, Popconfirm } from 'antd';
import { useNavigate } from 'react-router-dom';
import { FileImageTwoTone } from '@ant-design/icons';
import image from '../../assets/images/Logo-removebg-preview.png';
import { useGetProductosQuery, useCreateProductoMutation, useDeleteProductoMutation, useUpdateProductoMutation } from '../../features/Productos/ProductoApiSlice';

const { Option } = Select;

const ProductoForm = ({ onProductChange }) => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formChanged, setFormChanged] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);
    const [isEmpty, setIsEmpty] = useState(true);

    const { data: productos = [], refetch } = useGetProductosQuery();
    const [createProducto, { isLoading: creating }] = useCreateProductoMutation();
    const [updateProducto, { isLoading: updating }] = useUpdateProductoMutation();
    const [deleteProducto] = useDeleteProductoMutation();

    const columns = [
        {
            title: 'Código del Producto',
            dataIndex: 'codigo_producto',
            key: 'codigo_producto',
        },
        {
            title: 'Nombre del Producto',
            dataIndex: 'nombre_producto',
            key: 'nombre_producto',
        },
        {
            title: 'Unidad de Medida',
            dataIndex: 'unidad_medida',
            key: 'unidad_medida',
        },
        {
            title: 'Precio Costo',
            dataIndex: 'precio_costo',
            key: 'precio_costo',
        },
        {
            title: 'Precio Venta',
            dataIndex: 'precio_venta',
            key: 'precio_venta',
        },
        {
            title: 'Imagen',
            dataIndex: 'imagen',
            key: 'imagen',
            render: (text) => (
                <FileImageTwoTone
                    style={{ fontSize: '24px', cursor: 'pointer' }}
                    onClick={() => {
                        if (text) window.open(text, '_blank');
                    }}
                />
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            render: (_, record) => (
                <span>
                    <Button type="link" onClick={() => handleEdit(record)}>Editar</Button>
                    <Popconfirm
                        title="¿Estás seguro de eliminar este producto?"
                        onConfirm={() => handleDelete(record)}
                        okText="Sí"
                        cancelText="No"
                    >
                        <Button type="link" danger>Eliminar</Button>
                    </Popconfirm>
                </span>
            ),
        },
    ];

    const handleDelete = async (record) => {
        try {
            await deleteProducto(record.id_producto).unwrap();
            message.success('Producto eliminado correctamente');
            refetch();
            if (onProductChange) onProductChange();
        } catch (error) {
            console.error('Error al eliminar el producto:', error);
            message.error('Error al eliminar el producto');
        }
    };

    const handleEdit = (record) => {
        form.setFieldsValue({
            codigo_producto: record.codigo_producto,
            nombre_producto: record.nombre_producto,
            unidad_medida: record.unidad_medida,
            precio_costo: record.precio_costo,
            precio_venta: record.precio_venta,
            imagen: record.imagen,
            excedente: record.excedente,
        });
        setEditingProductId(record.id_producto);
        setFormChanged(true);
        setIsEmpty(false);
    };

    const calculatePrecioVenta = (precioCosto, excedente) => {
        if (precioCosto && excedente) {
            const percentage = parseFloat(excedente) / 100;
            return (precioCosto * (1 + percentage)).toFixed(2); // Fixed to 2 decimal places
        }
        return '';
    };

    const onFinish = async (values) => {
        try {
            if (editingProductId) {
                await updateProducto({ id_producto: editingProductId, ...values }).unwrap();
                message.success('Producto actualizado correctamente');
            } else {
                await createProducto(values).unwrap();
                message.success('Producto guardado correctamente');
            }
            form.resetFields();
            setFormChanged(false);
            setEditingProductId(null);
            setIsEmpty(true);
            refetch();
            if (onProductChange) onProductChange();
        } catch (error) {
            console.error('Error al procesar el producto:', error);
            message.error('Error al procesar el producto');
        }
    };

    const handleCancel = () => {
        form.resetFields();
        setFormChanged(false);
        setEditingProductId(null);
        setIsEmpty(true);
    };

    const handleValuesChange = (_, allValues) => {
        const isEmpty = Object.values(allValues).every((value) => !value);
        setIsEmpty(isEmpty);
        const { precio_costo, excedente } = allValues;
        const precioVenta = calculatePrecioVenta(precio_costo, excedente);
        form.setFieldsValue({ precio_venta: precioVenta });
    };

    return (
        <>
            <Row gutter={[16, 16]} style={{ marginTop: '30px' }}>
                <Col xs={24} sm={24} md={12} lg={13}>
                    <Card title="Formulario de Producto" bordered={false} style={{
                        maxWidth: '800px', marginTop: '30px',
                        boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                        borderRadius: '5px',
                    }}>
                        <Form
                            form={form}
                            name="producto_form"
                            onFinish={onFinish}
                            onValuesChange={handleValuesChange}
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                        >
                            <Form.Item
                                name="codigo_producto"
                                label="Código del Producto"
                                rules={[{ required: true, message: 'Por favor ingresa el código del producto!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="nombre_producto"
                                label="Nombre del Producto"
                                rules={[{ required: true, message: 'Por favor ingresa el nombre del producto!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                name="unidad_medida"
                                label="Unidad de Medida"
                                rules={[{ required: true, message: 'Por favor selecciona la unidad de medida!' }]}
                            >
                                <Select placeholder="Selecciona la unidad de medida">
                                    <Option value="Unidad">Unidad</Option>
                                    <Option value="Metro">Metro</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="precio_costo"
                                label={<span>Precio Costo</span>}
                                rules={[{ required: true, message: 'Por favor ingresa el precio costo!' }]}
                            >
                                <Input
                                    onChange={(e) => {
                                        const { value } = e.target;
                                        const numericValue = value.replace(/[^0-9.]/g, ''); // Allow only digits and a decimal point
                                        e.target.value = numericValue;
                                    }}
                                />
                            </Form.Item>

                            <Form.Item
                                name="excedente"
                                label="Excedente"
                                rules={[{ required: true, message: 'Por favor selecciona el excedente!' }]}
                            >
                                <Select placeholder="Selecciona el porcentaje de excedente">
                                    <Option value="0">0%</Option>
                                    <Option value="10">10%</Option>
                                    <Option value="15">15%</Option>
                                    <Option value="20">20%</Option>
                                    <Option value="25">25%</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="precio_venta"
                                label="Precio Venta"
                            >
                                <Input disabled />
                            </Form.Item>

                            <Form.Item
                                name="imagen"
                                label="URL de la Imagen"
                            >
                                <Input placeholder="https://example.com/imagen.jpg" />
                            </Form.Item>

                            <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                                <Button type="primary" htmlType="submit" loading={creating || updating}>
                                    {editingProductId ? 'Actualizar Producto' : 'Guardar Producto'}
                                </Button>
                                <Button style={{ marginLeft: '10px' }} onClick={handleCancel}>
                                    Cancelar
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8}>
                    <div className="text-center">
                        <img src={image} alt="logo" style={{ maxWidth: '100%', height: 'auto' }} />
                    </div>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginTop: '30px' }}>
                <Col span={24}>
                    <Card title="Lista de Productos" bordered={false}>
                        <Table
                            dataSource={productos}
                            columns={columns}
                            rowKey="codigo_producto"
                            pagination={{ position: ['bottomRight'], pageSize: 5 }}
                            loading={creating || updating}
                        />
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default ProductoForm;
    