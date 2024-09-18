import React from 'react';
import { Form, Input, Button, Select, Card } from 'antd';
import { useGetCategoriasQuery } from '../../features/categorias/CategoriasApiSlice';
import { useCreateServiceMutation } from '../../features/services/ServicesApiSlice';
import { useGetServiceByIdQuery } from '../../features/services/ServicesApiSlice';
import { useUpdateServiceMutation } from '../../features/services/ServicesApiSlice';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { message } from 'antd';
import image from '../../assets/images/Logo-removebg-preview.png';
import { Row, Col } from 'antd';

const { Option } = Select;

const ServicesForm = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const serviceId = searchParams.get('editar');

    const navigate = useNavigate();

    const [form] = Form.useForm();
    const { data: categorias, error, isLoading } = useGetCategoriasQuery();
    const [createService, { isLoading: isCreating, error: createError }] = useCreateServiceMutation();
    const isEditMode = Boolean(serviceId);

    const { data: service, isLoading: isLoadingService } = useGetServiceByIdQuery(serviceId, {
        skip: !isEditMode, // Only execute the query if in edit mode
    });

    const [updateService, { isLoading: isUpdating }] = useUpdateServiceMutation();
    const [formChanged, setFormChanged] = useState(false);

    const handleCancelEdit = () => {
        form.resetFields(); // Clear the form
        navigate('/mantenimiento/servicios'); // Change the URL
    };

    useEffect(() => {
        if (service && isEditMode) {
            form.setFieldsValue({
                nombre: service.nombre,
                descripcion: service.descripcion,
                categoria: service.categorias.map(cat => cat.id_categoria), // Preselect the service's categories
            });
        } else {
            form.resetFields(); // This will clear the form when exiting edit mode
        }
    }, [service, form, isEditMode]);

    const onFinish = async (values) => {
        const payload = {
            ...values
        };

        // Checking if in edit mode and if the form has changed
        if (isEditMode && !formChanged) {
            message.info('No se han realizado cambios.');
            return; // Exit if no changes were made
        }

        try {
            let response;
            if (isEditMode) {
                response = await updateService({ id: serviceId, ...payload }).unwrap();
                message.success('Servicio actualizado correctamente');
                console.log('Service updated successfully:', response);
            } else {
                response = await createService(payload).unwrap();
                message.success('Servicio creado correctamente');
                console.log('Service created successfully:', response);
            }
            form.resetFields();
            setFormChanged(false); // Reset the formChanged state after submission
        } catch (error) {
            console.error('Failed to process service:', error);
            message.error('Hubo un error al procesar el servicio.');
        }
    };

    if (isLoading) return <p>Cargando categorías...</p>;
    if (error) return <p>Error al cargar las categorías</p>;

    return (
        <Row gutter={[16, 16]} style={{ paddingTop: "30px" }}>
            <Col xs={24} sm={24} md={12} lg={13}>
                <Card title="Formulario de Servicios" bordered={false} style={{
                    maxWidth: '800px', marginTop: "30px",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    borderRadius: "5px",
                }}>
                    <Form
                        form={form}
                        name="services_form"
                        onFinish={onFinish}
                        onValuesChange={() => setFormChanged(true)}
                        initialValues={{ categoria: [] }} // Initial value as an empty array for multiple select
                        style={{ maxWidth: 600 }}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Form.Item
                            name="nombre"
                            label="Servicio"
                            rules={[{ required: true, message: 'Por favor ingresa el nombre del servicio!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="descripcion"
                            label="Descripción"
                            rules={[{ required: true, message: 'Por favor ingresa la descripción!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            name="categoria"
                            label="Categoría"
                            rules={[{ required: true, message: 'Por favor selecciona una categoría!' }]}
                        >
                            <Select
                                mode="multiple" // Enable multiple select
                                placeholder="Selecciona una o más categorías"
                                style={{ width: '100%' }}
                            >
                                {categorias?.map((cat) => (
                                    <Option key={cat.id_categoria} value={cat.id_categoria}>
                                        {cat.nombre}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                            <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                                {isEditMode ? 'Actualizar Servicio' : 'Agregar Servicio'}
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
            <Col xs={24} sm={24} md={12} lg={8} xl={8}> {/* Column size for the image */}
                <div className="text-center">
                    <img src={image} alt="logo" style={{ maxWidth: '100%', height: 'auto' }} />
                </div>
            </Col>
        </Row>
    );
};

export default ServicesForm;
