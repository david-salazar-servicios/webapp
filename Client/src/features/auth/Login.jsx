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

    // Fetch user data based on userId
    const { data: user, isSuccess } = useGetUserByIdQuery(userId, {
        skip: !userId,
    });

    const handleSubmit = async (values) => {
        try {
            const userData = await login(values).unwrap();
            dispatch(setCredentials({ ...userData }));
            localStorage.setItem('persist', persist ? 'true' : 'false');
    
            const decoded = jwtDecode(userData.accessToken); // Decode the JWT token
            setUserId(decoded.UserInfo.userId); // Set userId from decoded token
            setUserRoles(decoded.UserInfo.roles); // Set roles from decoded token
            
            toast.dismiss(); // Dismiss any previous toast
            toast.success('Logged in successfully!'); // Show success message

        } catch (err) {
            console.error('Failed to login:', err);
            toast.error('Failed to login. Please check your credentials.'); // Show error message
        }
    };

    useEffect(() => {
        if (user && isSuccess) {
            // Redirect based on roles
            if (user.password_reset) {
                navigate('/CambiarContrasenna');
            } else if (userRoles.includes('Admin')) {
                navigate('/mantenimiento/'); // Redirect Admin to the maintenance page
            } else if (userRoles.includes('Tecnico')) {
                navigate('/mantenimiento/'); // Redirect Tecnico to the index page
            } else {
                navigate('/'); // Default redirect if no matching roles
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
                    <Card className='bg-glass' style={{ borderRadius: "5px" }}>
                        <Form
                            form={form}
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: persist }}
                            onFinish={handleSubmit}
                        >
                            <div className="text-center mb-5">
                                <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                                <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                                <Link to="/Registrar" className="font-medium no-underline ml-2 text-blue-500">Register here</Link>
                            </div>
                            <Form.Item
                                name="email"
                                rules={[{ required: true, message: 'Please input your Email!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Email address" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox onChange={() => setPersist(!persist)}>Keep me connected</Checkbox>
                                </Form.Item>
                                <Link className="login-form-forgot" to="/RecuperarContrasenna">
                                    Forgot password?
                                </Link>
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button" style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }} loading={isLoading}>
                                    {isLoading ? 'Logging in...' : 'Login'}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
            <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
        </div>
    );
}

export default Login;
