import React from 'react';
import { Form, Input, Button, Card, Row, Col, message, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import image from '../../assets/images/Logo-removebg-preview.png'; // Ensure this path is correct

const { Option } = Select;

const ProductoForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formChanged, setFormChanged] = useState(false);
    
    const onFinish = async (values) => {
        try {
            // Handle form submission, e.g., sending data to an API
            console.log('Form values:', values);
            message.success('Producto guardado correctamente');
            form.resetFields();
            setFormChanged(false);
            
        } catch (error) {
            console.error('Error al procesar el producto:', error);
            message.error('Error al procesar el producto');
        }
    };

    const handleCancel = () => {
        form.resetFields();
        
    };

    return (
        <Row gutter={[16, 16]} style={{ marginTop: "30px" }}>
            <Col xs={24} sm={24} md={12} lg={13}>
                <Card title="Formulario de Producto" bordered={false} style={{
                    maxWidth: '800px', marginTop: "30px",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    borderRadius: "5px",
                }}>
                    <Form
                        form={form}
                        name="producto_form"
                        onFinish={onFinish}
                        onValuesChange={() => setFormChanged(true)}
                        initialValues={{}} // Initial values go here
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Form.Item
                            name="id_producto"
                            label="ID del Producto"
                            rules={[{ required: true, message: 'Por favor ingresa el ID del producto!' }]}
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
                            name="imagen"
                            label="URL de la Imagen"
                            rules={[{ required: true, message: 'Por favor ingresa un enlace a la imagen del producto!' }, { type: 'url', message: 'Por favor ingresa un URL válido!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                            <Button type="primary" htmlType="submit">
                                Guardar Producto
                            </Button>
                            <Button style={{ marginLeft: '10px' }} onClick={handleCancel}>
                                Cancelar
                            </Button>
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

export default ProductoForm;
