import React, { useEffect, useState } from 'react';
import { Spin, Card } from 'antd';
import { useGetProformasQuery } from '../../features/Proforma/ProformaApiSlice';
import { useGetSolicitudesQuery } from '../../features/RequestService/RequestServiceApiSlice';


export default function ReporteProformaYSolicitudes() {
    const { data: proformas, isLoading: loadingProformas, isError: errorProformas, error: errorProformaMessage } = useGetProformasQuery();
    const { data: solicitudes, isLoading: loadingSolicitudes, isError: errorSolicitudes, error: errorSolicitudMessage } = useGetSolicitudesQuery();
    
    const [totalProformasFinalizadas, setTotalProformasFinalizadas] = useState(0);
    const [totalSolicitudesConfirmadas, setTotalSolicitudesConfirmadas] = useState(0);

    useEffect(() => {
        if (proformas) {
            const finalizadas = proformas.filter(proforma => proforma.estado === 'Finalizada');
            const total = finalizadas.reduce((acc, proforma) => acc + parseFloat(proforma.total || 0), 0);
            setTotalProformasFinalizadas(total);
        }
    }, [proformas]);

    useEffect(() => {
        if (solicitudes) {
            const confirmadas = solicitudes.filter(solicitud => solicitud.estado === 'Confirmada');
            setTotalSolicitudesConfirmadas(confirmadas.length);
        }
    }, [solicitudes]);

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
