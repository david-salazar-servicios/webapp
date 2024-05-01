import React from 'react';
import { Form, Input, Button, Card, Row, Col, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useGetCategoriaByIdQuery, useCreateCategoriaMutation, useUpdateCategoriaMutation } from '../../features/categorias/CategoriasApiSlice';
import image from '../../assets/images/Logo-removebg-preview.png';

const CategoryForm = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const categoriaId = searchParams.get('editar');

    const [form] = Form.useForm();
    const isEditMode = Boolean(categoriaId);

    const { data: categoria, isLoading: isLoadingCategoria } = useGetCategoriaByIdQuery(categoriaId, {
        skip: !isEditMode,
    });

    const [createCategoria, { isLoading: isCreating }] = useCreateCategoriaMutation();
    const [updateCategoria, { isLoading: isUpdating }] = useUpdateCategoriaMutation();

    const [formChanged, setFormChanged] = useState(false);

    useEffect(() => {
        
        if (isEditMode && categoria) {
            form.setFieldsValue({
                nombre: categoria.nombre,
            });
        } else {
            form.resetFields();
        }
    }, [categoria, form, isEditMode]);

    const handleCancelEdit = () => {
        form.resetFields();
        navigate('/mantenimiento/categorias');
    };

    const onFinish = async (values) => {
        if (isEditMode && !formChanged) {
            message.info('No se han realizado cambios.');
            return;
        }
        try {
            let response;
            if (isEditMode) {
                response = await updateCategoria({ id: categoriaId, ...values }).unwrap();
                message.success('Categoría actualizada correctamente');
            } else {
                response = await createCategoria(values).unwrap();
                message.success('Categoría creada correctamente');
            }
            form.resetFields();
            setFormChanged(false);
            navigate('/mantenimiento/categorias');
        } catch (error) {
            console.error('Error al procesar la categoría:', error);
            message.error('Error al procesar la categoría');
        }
    };

    if (isLoadingCategoria) return <p>Cargando categoría...</p>;

    return (
        <Row gutter={[16, 16]} style={{ marginTop: "30px" }}>
            <Col xs={24} sm={24} md={12} lg={13}>
                <Card title="Formulario de Categorías" bordered={false} style={{
                    maxWidth: '800px', marginTop: "30px",
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    borderRadius: "5px",
                }}>
                    <Form
                        form={form}
                        name="categorias_form"
                        onFinish={onFinish}
                        onValuesChange={() => setFormChanged(true)}
                        initialValues={{}} // Initial values go here
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
                    >
                        <Form.Item
                            name="nombre"
                            label="Nombre de la Categoría"
                            rules={[{ required: true, message: 'Por favor ingresa el nombre de la categoría!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item wrapperCol={{ span: 16, offset: 8 }}>
                            <Button type="primary" htmlType="submit" loading={isCreating || isUpdating}>
                                {isEditMode ? 'Actualizar Categoría' : 'Agregar Categoría'}
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

export default CategoryForm;
