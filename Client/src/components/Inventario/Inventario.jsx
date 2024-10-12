import React from 'react';
import { Form, Input, Button, Card, Row, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import image from '../../assets/images/Logo-removebg-preview.png'; // Ensure this path is correct

const InventarioForm = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [formChanged, setFormChanged] = useState(false);
    
    const onFinish = async (values) => {
        try {
            // Handle form submission, e.g., sending data to an API
            console.log('Form values:', values);
            message.success('Inventario guardado correctamente');
            form.resetFields();
            setFormChanged(false);
            navigate('/mantenimiento/inventario');
        } catch (error) {
            console.error('Error al procesar el inventario:', error);
            message.error('Error al procesar el inventario');
        }
    };

    const handleCancel = () => {
        form.resetFields();
        navigate('/mantenimiento/inventario');
    };

    return (
        <Row gutter={[16, 16]} style={{ marginTop: "30px" }}>
            <Col xs={24} sm={24} md={12} lg={13}>
                <Card title="Formulario de Inventario" bordered={false} style={{
                    maxWidth: '800px', marginTop: "30px",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    borderRadius: "5px",
                }}>
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
                                Guardar Inventario
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

export default InventarioForm;
