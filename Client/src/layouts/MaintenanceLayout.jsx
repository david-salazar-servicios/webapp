import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { ROLES } from '../config/roles';
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
    const { username, roles } = useAuth();

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

    // Define all menu items with role-based visibility
    const allItems = [
        {
            label: 'Calendario',
            key: 'mantenimiento/',
            icon: <CalendarOutlined />,
            roles: [ROLES.Admin, ROLES.Tecnico]
        },
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
            icon: <UserAddOutlined />,
            roles: [ROLES.Admin]
        },
        {
            label: 'Gestion Inventario',
            key: 'mantenimiento/GestionInventario',
            icon: <FormOutlined />,
            roles: [ROLES.Admin]
        },
        {
            label: 'Proformas',
            key: 'mantenimiento/proformas',
            icon: <FormOutlined />,
            roles: [ROLES.Admin, ROLES.Tecnico]
        },
        {
            label: 'Reportes',
            key: 'mantenimiento/reportes',
            icon: <PieChartOutlined />,
            roles: [ROLES.Admin]
        },
        {
            label: 'Mantenimiento',
            key: 'sub1',
            icon: <SettingOutlined />,
            roles: [ROLES.Admin],
            children: [
                { label: 'Categorias', key: 'mantenimiento/categorias', roles: [ROLES.Admin] },
                { label: 'Servicios', key: 'mantenimiento/servicios', roles: [ROLES.Admin] },
                { label: 'Roles', key: 'mantenimiento/roles', roles: [ROLES.Admin] },
                { label: 'Catalogo', key: 'mantenimiento/catalogo', roles: [ROLES.Admin, ROLES.Inventario] },
                { label: 'Inventario', key: 'mantenimiento/inventario', roles: [ROLES.Admin] },
                { label: 'Cuentas IBAN', key: 'mantenimiento/cuentaiban', roles: [ROLES.Admin] }
            ]
        },
        {
            label: 'Perfiles',
            key: 'mantenimiento/perfiles',
            icon: <UserAddOutlined />,
            roles: [ROLES.Admin]
        },
        {
            label: 'Cambiar a Cliente',
            key: '',
            icon: <UserSwitchOutlined />,
            roles: [ROLES.Admin]
        },
        {
            label: 'Salir',
            key: 'logout',
            icon: <LoginOutlined />,
            roles: [ROLES.Admin, ROLES.Tecnico, ROLES.Inventario]
        }
    ];

    // Filter items based on user roles
    const filteredItems = allItems
        .filter(item => item.roles.some(role => roles.includes(role)))
        .map(item => {
            // If the item has children, filter the children too
            if (item.children) {
                return {
                    ...item,
                    children: item.children.filter(child =>
                        child.roles.some(role => roles.includes(role))
                    )
                };
            }
            return item;
        });

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
                    items={filteredItems}
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

