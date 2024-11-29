import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const PermissionDenied = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1 style={{ fontSize: '2rem', color: '#ff4d4f' }}>Acceso Denegado</h1>
            <p style={{ marginBottom: '20px' }}>
                No tienes permiso para acceder a esta página.
            </p>
            <Button type="primary" onClick={() => navigate('/')}>
                Volver al Inicio
            </Button>
        </div>
    );
};

export default PermissionDenied;
