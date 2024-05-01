import React, { useState } from 'react';
import { Form, Input, Button, Card, Row, Col, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useCreateUserMutation,useAssignRoleToUserMutation  } from "../../features/users/UsersApiSlice";

const { Title, Paragraph } = Typography;

const SignUp = () => {
    const navigate = useNavigate();
    const [createUser] = useCreateUserMutation();
    const [assignRole] = useAssignRoleToUserMutation();
    const [form] = Form.useForm();

    const onFinish = async (values) => {
      try {
          const newUser = await createUser(values).unwrap();
          // Después de crear el usuario, asigna el rol por defecto
          await assignRole({ id_usuario: newUser.id_usuario, id_rol: "2" }).unwrap();
          toast.success('Usuario creado con éxito');
          navigate('/Login');
      } catch (error) {
          toast.error('Error al crear el usuario');
          console.error('Failed to create the user: ', error);
      }
  };

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center background-radial-gradient overflow-hidden">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Row gutter={[16, 16]} style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                <Col span={24} md={12} className='text-center text-md-start d-flex flex-column justify-content-center'>
                    <Title level={1} className="fw-bold ls-tight" style={{ color: 'hsl(218, 81%, 95%)' }}>
                        El mejor servicio <br />
                        <span style={{ color: 'hsl(218, 81%, 75%)' }}>para usted!</span>
                    </Title>
                    <Paragraph className='px-3' style={{ color: 'hsl(218, 81%, 85%)' }}>
                        ¡Bienvenido a Servicios David Salazar! Aquí encontrarás las soluciones que tu hogar o negocio necesita. Unimos experiencia, profesionalismo y tecnología para brindarte el mejor servicio en fontanería y mantenimiento. Regístrate y descubre cómo podemos hacer tu vida más fácil y segura. Únete a nuestra comunidad y aprovecha los beneficios exclusivos que tenemos para ti.
                    </Paragraph>
                </Col>
                <Col span={24} md={12}>
                    <Card className='bg-glass' style={{ borderRadius: "5px" }}>
                        <Form form={form} name="register" onFinish={onFinish} layout="vertical" className='p-5'>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Form.Item name="nombre" label="First Name" rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                                <Col span={12}>
                                    <Form.Item name="apellido" label="Last Name" rules={[{ required: true, message: 'Por favor ingresa tu apellido' }]}>
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Form.Item name="telefono" label="Teléfono" rules={[{ required: true, message: 'Por favor ingresa su número telefónico' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="correo_electronico" label="Email" rules={[{ required: true, type: 'email', message: 'Por favor ingresa un correo electrónico válido' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item name="contrasena" label="Password" rules={[{ required: true, message: 'Por favor ingresa tu contraseña' }]}>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className='w-100'>Registrarse</Button>
                            </Form.Item>
                            <Form.Item>
                                <Link to='/Login'>¿Ya tienes una cuenta? Inicia sesión</Link>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default SignUp;
