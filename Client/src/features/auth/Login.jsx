import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Checkbox, Row, Col, Card } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import usePersist from '../../hooks/usePersist';
import { useLoginMutation } from './authApiSlice';
import { setCredentials } from './authSlice';
import { toast, ToastContainer } from 'react-toastify';
import image from '../../assets/images/Logo-removebg-preview.png';
import { jwtDecode } from 'jwt-decode';
import { useGetUserByIdQuery } from '../users/UsersApiSlice';

function Login() {
    const [form] = Form.useForm();
    const [persist, setPersist] = usePersist();
    const [login, { isLoading }] = useLoginMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userRoles, setUserRoles] = useState([]);

    const userRef = useRef();
    const [userId, setUserId] = useState(null);

    const { data: user, isSuccess } = useGetUserByIdQuery(userId, {
        skip: !userId,
    });

    const handleSubmit = async (values) => {
        try {
            const userData = await login(values).unwrap();
            dispatch(setCredentials({ ...userData }));
            localStorage.setItem('persist', persist ? 'true' : 'false');

            const decoded = jwtDecode(userData.accessToken);
            setUserId(decoded.UserInfo.userId);
            setUserRoles(decoded.UserInfo.roles);

            toast.dismiss();
            toast.success('¡Inicio de sesión exitoso!');
        } catch (err) {
            console.error('Error al iniciar sesión:', err);
            toast.error('Error al iniciar sesión. Por favor, verifica tus credenciales.');
        }
    };

    useEffect(() => {
        if (user && isSuccess) {
            if (user.password_reset) {
                navigate('/CambiarContrasenna');
            } else if (userRoles.includes('Admin')) {
                navigate('/mantenimiento/');
            } else if (userRoles.includes('Tecnico')) {
                navigate('/mantenimiento/');
            } else {
                navigate('/');
            }
        }
    }, [user, userRoles, navigate, isSuccess]);

    return (
        <div className="min-vh-100 d-flex justify-content-center align-items-center background-radial-gradient overflow-hidden">
            <Row gutter={[16, 16]} style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                <Col span={24} className="background-row">
                    <div className="text-center">
                        <img src={image} style={{ width: '285px' }} alt="logo" />
                    </div>
                    <Card
                        className="bg-transparent"
                        style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '5px',
                            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                            border: 'none',
                        }}
                    >
                        <Form
                            form={form}
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: persist }}
                            onFinish={handleSubmit}
                        >
                            <div className="text-center mb-5">
                                <div className="text-900 text-3xl font-medium mb-3" style={{ fontSize: '24px',color:'white' }}>
                                    Bienvenido de nuevo
                                </div>
                                <span className="text-600 font-medium line-height-3" style={{ fontSize: '16px',color:'white' }}>
                                    ¿No tienes una cuenta?
                                </span>
                                <Link
                                    to="/Registrar"
                                    className="font-medium no-underline ml-2 text-blue-500"
                                    style={{ fontSize: '16px' }}
                                >
                                    Regístrate aquí
                                </Link>
                            </div>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Por favor, ingresa tu correo electrónico.' }]}
                                style={{ marginBottom: '20px' }}
                            >
                                <Input
                                    prefix={<UserOutlined className="site-form-item-icon" />}
                                    placeholder="Correo electrónico"
                                    style={{
                                        padding: '15px',
                                        fontSize: '18px',
                                        borderRadius: '8px',
                                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
                                    }}
                                />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Por favor, ingresa tu contraseña.' }]}
                                style={{ marginBottom: '20px' }}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Contraseña"
                                    style={{
                                        padding: '15px',
                                        fontSize: '18px',
                                        borderRadius: '8px',
                                        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.2)',
                                    }}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox onChange={() => setPersist(!persist)} style={{ fontSize: '16px',color:'white' }}>
                                        Mantenerme conectado
                                    </Checkbox>
                                </Form.Item>
                                <Link
                                    className="login-form-forgot"
                                    to="/RecuperarContrasenna"
                                    style={{ fontSize: '16px', marginLeft: '15px' }}
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </Form.Item>
                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    className="login-form-button"
                                    style={{
                                        width: '100%',
                                        maxWidth: '600px',
                                        margin: '0 auto',
                                        padding: '15px',
                                        fontSize: '18px',
                                        borderRadius: '8px',
                                        color:'white'
                                    }}
                                    loading={isLoading}
                                >
                                    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}

export default Login;
