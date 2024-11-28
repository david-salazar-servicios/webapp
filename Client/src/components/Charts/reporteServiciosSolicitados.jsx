import React from 'react';
import { Chart } from 'primereact/chart';
import { useGetServiceSolicitudesReportQuery } from '../../features/RequestService/RequestServiceApiSlice';
import { Spin, Card } from 'antd';

export default function ReporteServiciosSolicitados() {
    const { data: reportData, isLoading, isError } = useGetServiceSolicitudesReportQuery();

    // Prepare chart data
    const chartData = reportData
        ? {
              labels: reportData.map((item) => item.servicio_nombre),
              datasets: [
                  {
                      label: 'Total Solicitudes',
                      data: reportData.map((item) => item.total_solicitudes),
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      borderColor: 'rgba(75, 192, 192, 1)',
                      borderWidth: 1,
                  },
              ],
          }
        : null;

    // Chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Allow customization of chart height and width
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Servicios Solicitados',
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Servicios',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Total Solicitudes',
                },
                beginAtZero: true,
            },
        },
    };

    if (isLoading) {
        return <Spin tip="Cargando datos..." />;
    }

    if (isError) {
        return <div>Error al cargar los datos. Intente nuevamente.</div>;
    }

    return (
        <Card
            title="Reporte de Servicios Solicitados"
            bordered
            style={{
                maxWidth: '100%',
                margin: '20px auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px',
            }}
        >
            {chartData ? (
                <div style={{ width: '100%', height: '400px' }}> {/* Container for the chart */}
                    <Chart type="bar" data={chartData} options={chartOptions} style={{ height: '100%', width: '100%' }} />
                </div>
            ) : (
                <div>No hay datos disponibles para mostrar.</div>
            )}
        </Card>
    );
}
