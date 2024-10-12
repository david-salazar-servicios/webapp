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
    UserSwitchOutlined
} from '@ant-design/icons';
import { Layout, Menu, Modal, List, Badge, Card, Typography, Row, Col } from 'antd';
import io from 'socket.io-client';
import { format } from 'date-fns'; // Ensure you import the date-fns format function
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

    // Calculate the number of "Pendiente" solicitudes
    const pendientesCount = solicitudes ? solicitudes.filter(solicitud => solicitud.estado === 'Pendiente').length : 0;

    useEffect(() => {
        socketRef.current = io('http://localhost:3000', { withCredentials: true });

        socketRef.current.on('solicitudCreada', (data) => {
            setNotificationData(data);
            setModalVisible(true); // Show the modal when data is received
            refetch(); // Trigger a refetch of getSolicitudes query
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, [refetch]);
    console.log(notificationData)
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
        { label: 'Home', key: 'mantenimiento/index', icon: <HomeOutlined /> },
        { label: 'Reportes', key: 'mantenimiento/reportes', icon: <PieChartOutlined /> },
        { label: 'Perfiles', key: 'mantenimiento/perfiles', icon: <UserAddOutlined /> },
        {
            label: 'Mantenimiento',
            key: 'sub1',
            icon: <SettingOutlined />,
            children: [
                { label: 'Categorias', key: 'mantenimiento/categorias' },
                { label: 'Servicios', key: 'mantenimiento/servicios' },
                { label: 'Roles', key: 'mantenimiento/roles' },
                { label: 'Catalogo', key: 'mantenimiento/catalogo' },
                { label: 'Inventario', key: 'mantenimiento/inventario' }
            ]
        },
        {
            label: (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <span>Solicitudes</span>
                    <Badge
                        count={pendientesCount} // Show count of pendientes
                        style={{ backgroundColor: '#52c41a', marginLeft: 10 }}
                        size='small'
                    />
                </div>
            ),
            key: 'mantenimiento/solicitudes',
            icon: <UserAddOutlined />
        },
        { label: 'Facturación', key: 'mantenimiento/facturacion', icon: <FormOutlined /> },
        { label: 'Gestion Inventario', key: 'mantenimiento/GestionInventario', icon: <FormOutlined /> },
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
            <Sider className='maintSlider'collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div className="demo-logo-vertical" />
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
                <Col span={12}>
                    <Text strong>Apellido: </Text>
                    <Text>{notificationData.solicitud?.apellido}</Text>
                </Col>
                <Col span={12}>
                    <Text strong>Correo Electrónico: </Text>
                    <Text>{notificationData.solicitud?.correo_electronico}</Text>
                </Col>
                <Col span={12}>
                    <Text strong>Teléfono: </Text>
                    <Text>{notificationData.solicitud?.telefono}</Text>
                </Col>
                <Col span={12}>
                    <Text strong>Fecha Creación: </Text>
                    <Text>{formatFechaCreacion(notificationData.solicitud?.fecha_creacion)}</Text>
                </Col>
                {notificationData.solicitud?.observacion && (
                    <Col span={24}>
                        <Text strong>Observación: </Text>
                        <Text>{notificationData.solicitud?.observacion}</Text>
                    </Col>
                )}
            </Row>
        </Card>

        {/* Title for Servicios */}
        <Title level={4} style={{ marginBottom: '16px' }}>Servicios Solicitados</Title>

        {/* Card for Each Servicio */}
        {notificationData.solicitud?.servicios?.map((servicio, index) => (
            <Card
                key={index}
                title={servicio.servicio_nombre}
                bordered={true}
                style={{ marginBottom: '20px', borderRadius: '8px' }}
            >
                <List
                    itemLayout="horizontal"
                    dataSource={servicio.detalles || []}
                    renderItem={detalle => (
                        <List.Item>
                            <List.Item.Meta
                                description={
                                    <span>
                                        <CheckCircleOutlined style={{ color: 'green', marginRight: 30 }} />
                                        {detalle}
                                    </span>
                                }
                            />
                        </List.Item>
                    )}
                />
            </Card>
        ))}
    </Modal>
</Content>
            </Layout>
        </Layout>
    );
};

export default MaintenanceLayout;
