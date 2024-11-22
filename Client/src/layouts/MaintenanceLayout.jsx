import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { useGetSolicitudesQuery } from '../features/RequestService/RequestServiceApiSlice';
import {
    PieChartOutlined,
    UserAddOutlined,
    UserOutlined,
    SettingOutlined,
    FormOutlined,
    LoginOutlined,
    UserSwitchOutlined,
    CalendarOutlined
} from '@ant-design/icons';
import { Layout, Menu, Badge, Typography } from 'antd';
import useAuth from '../hooks/useAuth';

const { Text } = Typography;
const { Content, Sider } = Layout;

const MaintenanceLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const [sendLogout] = useSendLogoutMutation();
    const { data: solicitudes } = useGetSolicitudesQuery();

    // Get the logged-in user details
    const { username } = useAuth();

    const pendientesCount = solicitudes
        ? solicitudes.filter((solicitud) => solicitud.estado === 'Pendiente').length
        : 0;

    const handleSubmit = async () => {
        try {
            await sendLogout().unwrap();
            navigate('/Login');
        } catch (err) {
            console.error('Logout failed: ', err);
        }
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
                        size="small"
                    />
                </div>
            ),
            key: 'mantenimiento/solicitudes',
            icon: <UserAddOutlined />
        },
        { label: 'Gestion Inventario', key: 'mantenimiento/GestionInventario', icon: <FormOutlined /> },
        { label: 'Proformas', key: 'mantenimiento/proformas', icon: <FormOutlined /> },
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
        { label: 'Salir', key: 'logout', icon: <LoginOutlined /> }
    ];

    const onMenuClick = ({ key }) => {
        if (key === 'logout') {
            handleSubmit();
        } else {
            navigate(`/${key}`);
        }
    };

    return (
        <Layout style={{ minHeight: '100vh' }} className="maintenance-layout">
            <Sider
                className="maint-slider"
                collapsible
                collapsed={collapsed}
                onCollapse={setCollapsed}
                breakpoint="md"
            >
                <div className="username-display" style={{ display: 'flex', alignItems: 'center', padding: '16px' }}>
                    <UserOutlined style={{ color: 'white', fontSize: '1.2rem' }} />
                    {!collapsed && (
                        <Text style={{ color: 'white', marginLeft: '8px' }} strong>
                            Bienvenido {username || 'Guest'}
                        </Text>
                    )}
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
                <Content style={{ padding: '20px' }} className="content-layout">
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MaintenanceLayout;
