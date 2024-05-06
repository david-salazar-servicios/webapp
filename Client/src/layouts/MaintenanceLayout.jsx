import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { useGetSolicitudesQuery } from '../features/RequestService/RequestServiceApiSlice';
import {
    PieChartOutlined,
    HomeOutlined,
    UserAddOutlined,
    SettingOutlined,
    FormOutlined,
    LoginOutlined,
    UserSwitchOutlined
} from '@ant-design/icons';
import { Layout, Menu, Modal, List, Badge } from 'antd';
import io from 'socket.io-client';
import { format } from 'date-fns'; // Ensure you import the date-fns format function

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
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
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
                        title="Nueva Solicitud Creada"
                        open={modalVisible}
                        onOk={() => setModalVisible(false)}
                        onCancel={() => setModalVisible(false)}
                        footer={null}
                    >
                        <p><strong>Mensaje:</strong> {notificationData.message}</p>
                        <p><strong>ID Solicitud:</strong> {notificationData.solicitud?.id_solicitud}</p>
                        <p><strong>Nombre:</strong> {notificationData.solicitud?.nombre}</p>
                        <p><strong>Apellido:</strong> {notificationData.solicitud?.apellido}</p>
                        <p><strong>Correo Electrónico:</strong> {notificationData.solicitud?.correo_electronico}</p>
                        <p><strong>Teléfono:</strong> {notificationData.solicitud?.telefono}</p>
                        <p><strong>Fecha Creación:</strong> {formatFechaCreacion(notificationData.solicitud?.fecha_creacion)}</p>
                        <p><strong>Observación:</strong> {notificationData.solicitud?.observacion}</p>
                        <List
                            itemLayout="horizontal"
                            dataSource={notificationData.solicitud?.detalles || []}
                            renderItem={item => (
                                <List.Item>
                                    <List.Item.Meta
                                        title={<span>{item.servicio_nombre}</span>}
                                        description={item.servicio_descripcion}
                                    />
                                </List.Item>
                            )}
                        />
                    </Modal>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MaintenanceLayout;
