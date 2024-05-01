import React from 'react';
import { Form, Input, Button, Card, Row, Col, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { useSendLogoutMutation } from '../../features/auth/authApiSlice';
import { useChangePasswordMutation } from './ResetPassowrdApiSlice'; // Asume que tienes una API Slice para cambiar la contraseña
import useAuth from "../../hooks/useAuth";
import { useState,useEffect } from 'react';
const { Title } = Typography;

const ChangePassword = () => {
    const [sendLogout] = useSendLogoutMutation();
    const navigate = useNavigate();
    const [form] = Form.useForm();
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const auth = useAuth() || {};
    const { userId } = auth; 

    const [id, setId] = useState(userId);

    useEffect(() => {
        setId(userId); 
    }, [userId]); 

    const onFinish = async (values) => {
        try {
            const response = await changePassword({ 
                id, // Usa el estado 'id' aquí directamente
                newPassword: values.newPassword,
                tempPassword: values.tempPassword
            }).unwrap();
            
            toast.success(response.message || 'Tu contraseña ha sido cambiada con éxito');
            await sendLogout().unwrap();
            navigate('/Login');
        } catch (error) {
            const errorMessage = error.data?.message || error.error || 'Error al intentar cambiar la contraseña';
            toast.error(errorMessage);
            console.error('Failed to change the password:', error);
        }
    };
    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center background-radial-gradient overflow-hidden">
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            <Row gutter={[16, 16]} style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                <Col span={24}>
                    <Card className='bg-glass' style={{ borderRadius: "5px" }}>
                        <Form form={form} name="change_password" onFinish={onFinish} layout="vertical" className='p-5'>
                            <Title level={2} className="fw-bold" style={{ color: '#555' }}>Change your password</Title>
                            <Form.Item 
                                name="tempPassword" 
                                label="Temporary Password" 
                                rules={[{ required: true, message: 'Por favor ingresa tu contraseña temporal' }]}>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item 
                                name="newPassword" 
                                label="New Password" 
                                rules={[{ required: true, message: 'Por favor ingresa tu nueva contraseña' }]}>
                                <Input.Password />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className='w-100' loading={isLoading}>Cambiar contraseña</Button>
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

export default ChangePassword;
