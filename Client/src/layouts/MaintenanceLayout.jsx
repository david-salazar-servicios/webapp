import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { useGetSolicitudesQuery } from '../features/RequestService/RequestServiceApiSlice';
import {
    CheckCircleOutlined,
    PieChartOutlined,
    HomeOutlined,
    UserAddOutlined,
    SettingOutlined,
    FormOutlined,
    LoginOutlined,
    UserSwitchOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { Layout, Menu, Modal, List, Badge, Card, Typography, Row, Col } from 'antd';
import io from 'socket.io-client';
import { format } from 'date-fns';
import useAuth from '../hooks/useAuth';

const { Text, Title } = Typography;
const { Content, Sider } = Layout;

const MaintenanceLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [notificationData, setNotificationData] = useState({});
    const navigate = useNavigate();
    const [sendLogout] = useSendLogoutMutation();
    const socketRef = useRef(null);
    const { data: solicitudes, refetch } = useGetSolicitudesQuery();
    
    // Get the logged-in user details
    const { username } = useAuth(); // Get username from useAuth hook

    const pendientesCount = solicitudes ? solicitudes.filter(solicitud => solicitud.estado === 'Pendiente').length : 0;

    useEffect(() => {
        socketRef.current = io('http://localhost:3000', { withCredentials: true });

        socketRef.current.on('solicitudCreada', (data) => {
            setNotificationData(data);
            setModalVisible(true);
            refetch();
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [refetch]);

    const handleSubmit = async () => {
        try {
            await sendLogout().unwrap();
            navigate('/Login');
        } catch (err) {
            console.error('Logout failed: ', err);
        }
    };

    const formatFechaCreacion = (fecha) => {
        if (fecha) {
            try {
                return format(new Date(fecha), 'yyyy-MM-dd HH:mm');
            } catch (e) {
                console.error('Invalid date value:', e);
                return 'Invalid date';
            }
        }
        return 'No date';
    };

    const items = [
        { label: 'Calendario', key: 'mantenimiento/index', icon: <CalendarOutlined /> },
        {
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>Solicitudes</span>
                    <Badge
                        count={pendientesCount}
                        style={{ backgroundColor: '#52c41a', marginLeft: 10 }}
                        size='small'
                    />
                </div>
            ),
            key: 'mantenimiento/solicitudes',
            icon: <UserAddOutlined />
        },
        { label: 'Gestion Inventario', key: 'mantenimiento/GestionInventario', icon: <FormOutlined /> },
        { label: 'Proforma', key: 'mantenimiento/facturacion', icon: <FormOutlined /> },
        { label: 'Reportes', key: 'mantenimiento/reportes', icon: <PieChartOutlined /> },
        
        {
            label: 'Mantenimiento',
            key: 'sub1',
            icon: <SettingOutlined />,
            children: [
                { label: 'Categorias', key: 'mantenimiento/categorias' },
                { label: 'Servicios', key: 'mantenimiento/servicios' },
                { label: 'Roles', key: 'mantenimiento/roles' },
                { label: 'Catalogo', key: 'mantenimiento/catalogo' },
                { label: 'Inventario', key: 'mantenimiento/inventario' },
                { label: 'Cuentas IBAN', key: 'mantenimiento/cuentaiban' }
            ]
        },
        
        { label: 'Perfiles', key: 'mantenimiento/perfiles', icon: <UserAddOutlined /> },
        
        { label: 'Cambiar a Cliente', key: '', icon: <UserSwitchOutlined /> },
        { label: 'Salir', key: 'logout', icon: <LoginOutlined /> },
    ];

    const onMenuClick = ({ key }) => {
        if (key === 'logout') {
            handleSubmit();
        } else {
            navigate(`/${key}`);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider className='maintSlider' collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div className="demo-logo-vertical" />
                
                {/* Display Username */}
                <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
                    <Text style={{color:"white"}}strong>Bienvenido, {username || 'Guest'}</Text>
                </div>

                <Menu
                    theme="dark"
                    defaultSelectedKeys={['1']}
                    mode="inline"
                    items={items}
                    onClick={onMenuClick}
                />
            </Sider>
            <Layout>
                <Content style={{ padding: '20px' }}>
                    <Outlet />
                    <Modal
                        title={<Title level={3} style={{ marginBottom: 0 }}>Nueva Solicitud Creada</Title>}
                        open={modalVisible}
                        onOk={() => setModalVisible(false)}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                        bodyStyle={{ padding: '20px' }}
                        width={850}
                    >
                        {/* Card for Solicitud Information */}
                        <Card
                            title={<Title level={4}>Información de la Solicitud</Title>}
                            bordered={false}
                            style={{ marginBottom: '20px', backgroundColor: '#f6f9fc', borderRadius: '8px' }}
                        >
                            <Row gutter={[16, 16]}>
                                <Col span={12}>
                                    <Text strong>ID Solicitud: </Text>
                                    <Text>{notificationData.solicitud?.id_solicitud}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text strong>Nombre: </Text>
                                    <Text>{notificationData.solicitud?.nombre}</Text>
                                </Col>
                                {/* Other fields */}
                            </Row>
                        </Card>
                    </Modal>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MaintenanceLayout;
