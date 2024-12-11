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
        } else {
            console.warn('Proformas data is not an array:', proformasData);
        }
    }, [proformasData]);

    useEffect(() => {
        if (Array.isArray(solicitudesData)) {
            const confirmadas = solicitudesData.filter(solicitud => solicitud.estado === 'Confirmada');
            setTotalSolicitudesConfirmadas(confirmadas.length);
        } else {
            console.warn('Solicitudes data is not an array:', solicitudesData);
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
        <div className="reporte-container">
            {/* Card para Proformas Finalizadas */}
            <Card
            
                bordered={false}
                className="reporte-card"
            >
                <h4>Total de Proformas Finalizadas</h4>
                <div className="reporte-card-value">
                    {`₡ ${new Intl.NumberFormat('en-US').format(totalProformasFinalizadas)}`}
                </div>
            </Card>

            {/* Card para Solicitudes Confirmadas */}
            <Card
                bordered={false}
                className="reporte-card"
            >
                <h4>Total de Solicitudes Confirmadas</h4>
                <div className="reporte-card-value">
                    {totalSolicitudesConfirmadas}
                </div>
            </Card>
        </div>
    );
}
