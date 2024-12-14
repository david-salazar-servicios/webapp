import React, { useEffect, useState } from 'react';
import { Spin, Card } from 'antd';
import { useGetProformasQuery } from '../../features/Proforma/ProformaApiSlice';
import { useGetSolicitudesQuery } from '../../features/RequestService/RequestServiceApiSlice';

export default function ReporteProformaYSolicitudes() {
    const { data: proformasData, isLoading: loadingProformas, isError: errorProformas, error: errorProformaMessage } = useGetProformasQuery();
    const { data: solicitudesData, isLoading: loadingSolicitudes, isError: errorSolicitudes, error: errorSolicitudMessage } = useGetSolicitudesQuery();

    const [totalProformasFinalizadas, setTotalProformasFinalizadas] = useState(0);
    const [totalSolicitudesConfirmadas, setTotalSolicitudesConfirmadas] = useState(0);

    useEffect(() => {
        if (Array.isArray(proformasData)) {
            const finalizadas = proformasData.filter(proforma => proforma.estado === 'Finalizada');
            const total = finalizadas.reduce((acc, proforma) => acc + parseFloat(proforma.total || 0), 0);
            setTotalProformasFinalizadas(total);
        }
    }, [proformasData]);

    useEffect(() => {
        if (Array.isArray(solicitudesData)) {
            const confirmadas = solicitudesData.filter(solicitud => solicitud.estado === 'Confirmada');
            setTotalSolicitudesConfirmadas(confirmadas.length);
        }
    }, [solicitudesData]);

    if (loadingProformas || loadingSolicitudes) {
        return <Spin tip="Cargando datos..." />;
    }

    if (errorProformas || errorSolicitudes) {
        return (
            <div>
                Error al cargar datos: {errorProformaMessage?.data?.error || errorSolicitudMessage?.data?.error || 'Unknown error'}
            </div>
        );
    }

    return (
        <div
            className="reporte-proforma-solicitudes-container"
            style={{
                display: 'flex',
                justifyContent: 'center', // Centrar horizontalmente
                alignItems: 'center', // Centrar verticalmente
                gap: '20px', // Espaciado entre las tarjetas
                flexWrap: 'wrap', // Permitir que se ajusten en dispositivos pequeños
            }}
        >
            {/* Card para Proformas Finalizadas */}
            <Card
                bordered={false}
                className="reporte-card"
                style={{
                    width: '300px',
                    height: '150px',
                    backgroundColor: '#EAF8FF',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                }}
            >
                <h4>Total de Proformas Finalizadas</h4>
                <div
                    className="reporte-card-value"
                    style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#05579E',
                    }}
                >
                    {`₡ ${new Intl.NumberFormat('en-US').format(totalProformasFinalizadas)}`}
                </div>
            </Card>

            {/* Card para Solicitudes Confirmadas */}
            <Card
                bordered={false}
                className="reporte-card"
                style={{
                    width: '300px',
                    height: '150px',
                    backgroundColor: '#EAF8FF',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    borderRadius: '10px',
                }}
            >
                <h4>Total de Solicitudes Confirmadas</h4>
                <div
                    className="reporte-card-value"
                    style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        color: '#05579E',
                    }}
                >
                    {totalSolicitudesConfirmadas}
                </div>
            </Card>
        </div>
    );
}
