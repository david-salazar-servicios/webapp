import React from 'react';
import { Form, Input, Button, Card, Row, Col, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useSendResetPasswordEmailMutation } from "./ResetPassowrdApiSlice";

const { Title } = Typography;

const ResetPassword = () => {
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [sendResetPasswordEmail, { isLoading }] = useSendResetPasswordEmailMutation();

    const onFinish = async (values) => {
        try {
            const response = await sendResetPasswordEmail({ email: values.email }).unwrap();
            toast.success(response.message || 'Se ha enviado un enlace para restablecer tu contraseña a tu correo electrónico');
            navigate('/Login');
        } catch (error) {
            console.error('Complete error object:', error); // Para debuggear
            // Intenta acceder al mensaje de error en diferentes formas
            const errorMessage = error.data?.message || error.error || error.response?.data?.message || 'Error al intentar restablecer la contraseña';
            toast.error(errorMessage);
            console.error('Failed to reset the password: ', error);
        }
    };
    
    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center background-radial-gradient overflow-hidden">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Row gutter={[16, 16]} style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                <Col span={24}>
                    <Card className='bg-glass' style={{ borderRadius: "5px" }}>
                        <Form form={form} name="reset_password" onFinish={onFinish} layout="vertical" className='p-5'>
                            <Title level={2} className="fw-bold" style={{ color: '#555' }}>Reset your password</Title>
                            <Form.Item name="email" label="Email address" rules={[{ required: true, type: 'email', message: 'Por favor ingresa un correo electrónico válido' }]}>
                                <Input />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className='w-100' loading={isLoading}>Enviar</Button>
                            </Form.Item>
                            <Form.Item>
                                <Link to='/Login'>Volver al inicio de sesión</Link>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default ResetPassword;
