import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Spin, Card } from 'antd';
import { useGetProformasQuery } from '../../features/Proforma/ProformaApiSlice'; 

export default function ReporteProforma() {
    const { data: proformas, isLoading, isError, error } = useGetProformasQuery(); // Fetch all proformas
    const [chartData, setChartData] = useState(null);
    const [chartOptions, setChartOptions] = useState(null);
    
    useEffect(() => {
        if (proformas) {
            // Filter proformas with estado "Finalizada"
            const finalizadas = proformas.filter(proforma => proforma.estado === 'Finalizada');
            // Calculate the total of filtered proformas
            const total = finalizadas.reduce((acc, proforma) => acc + parseFloat(proforma.total || 0), 0);
    
            // Prepare chart data
            setChartData({
                labels: ['Total de Proformas Finalizadas'],
                datasets: [
                    {
                        data: [total],
                        backgroundColor: ['#FFA726'], // Doughnut color
                        hoverBackgroundColor: ['#FF7043'], // Hover effect color
                    },
                ],
            });
    
            // Chart options
            setChartOptions({
                cutout: '70%', // Doughnut inner radius
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => `₡ ${new Intl.NumberFormat('en-US').format(context.raw)}`, // Format tooltip
                        },
                    },
                },
            });
        }
    }, [proformas]);
    
    if (isLoading) {
        return <Spin tip="Cargando datos..." />;
    }

    if (isError) {
        return <div>Error al cargar las proformas: {error?.data?.error || 'Unknown error'}</div>;
    }

    return (
        <Card
            title="Total de Proformas"
            bordered={false}
            style={{
                boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                borderRadius: '5px',
            }}
        >
            {chartData ? (
                <div style={{ maxWidth  : '400px', margin: '0 auto' }}>
                    <Chart type="doughnut" data={chartData} options={chartOptions} />
                    <div
                        style={{
                            position: 'relative',
                            textAlign: 'center',
                            fontWeight: 'bold',
                            fontSize: '20px',   
                            color: '#FFA726',
                            marginTop:'20px'
                        }}
                    >
                        {`₡ ${new Intl.NumberFormat('en-US').format(
                            proformas.reduce((acc, proforma) => acc + parseFloat(proforma.total || 0), 0)
                        )}`}
                    </div>
                </div>
            ) : (
                <div>No hay datos disponibles para mostrar.</div>
            )}
        </Card>
    );
}