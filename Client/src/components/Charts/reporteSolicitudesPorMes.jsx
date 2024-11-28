import React, { useMemo, useState } from 'react';
import { Chart } from 'primereact/chart';
import { useGetSolicitudesQuery } from '../../features/RequestService/RequestServiceApiSlice';
import { Spin, Card, Space, DatePicker } from 'antd';

const { MonthPicker } = DatePicker;

export default function ReporteSolicitudesPorMes() {
    const { data: solicitudes, isLoading, isError } = useGetSolicitudesQuery();

    // Configure the current and next month as default values
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First day of the next month

    const [startMonth, setStartMonth] = useState(currentMonth); // Initial month
    const [endMonth, setEndMonth] = useState(new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0)); // Last day of the next month

    // Handle start month change
    const handleStartMonthChange = (date) => {
        setStartMonth(date ? new Date(date.year(), date.month(), 1) : null); // First day of the selected month
    };

    // Handle end month change
    const handleEndMonthChange = (date) => {
        setEndMonth(date ? new Date(date.year(), date.month() + 1, 0) : null); // Last day of the selected month
    };

    const filteredSolicitudesData = useMemo(() => {
        if (!solicitudes || !startMonth || !endMonth) {
            return null;
        }

        // Filter solicitudes based on the selected date range
        const filteredSolicitudes = solicitudes.filter((solicitud) => {
            const solicitudDate = new Date(solicitud.fecha_preferencia); // Convert to native date
            return solicitudDate >= startMonth && solicitudDate <= endMonth; // Compare ranges
        });

        // Group and count solicitudes by month
        const monthCounts = {};
        filteredSolicitudes.forEach((solicitud) => {
            const solicitudDate = new Date(solicitud.fecha_preferencia);
            const monthYear = `${solicitudDate.toLocaleString('default', { month: 'long' })} ${solicitudDate.getFullYear()}`;
            monthCounts[monthYear] = (monthCounts[monthYear] || 0) + 1;
        });

        // Sort months chronologically
        const sortedMonths = Object.keys(monthCounts).sort((a, b) => {
            const [monthA, yearA] = a.split(' ');
            const [monthB, yearB] = b.split(' ');
            return new Date(`${yearA}-${new Date(Date.parse(`${monthA} 1`)).getMonth() + 1}-01`) -
                   new Date(`${yearB}-${new Date(Date.parse(`${monthB} 1`)).getMonth() + 1}-01`);
        });

        return {
            labels: sortedMonths,
            data: sortedMonths.map((month) => monthCounts[month]),
        };
    }, [solicitudes, startMonth, endMonth]);

    const chartData = filteredSolicitudesData
        ? {
            labels: filteredSolicitudesData.labels,
            datasets: [
                {
                    label: 'Solicitudes por Mes',
                    data: filteredSolicitudesData.data,
                    fill: true,
                    borderColor: '#42A5F5',
                    backgroundColor: 'rgba(66, 165, 245, 0.2)',
                    tension: 0.4,
                },
            ],
        }
        : null;

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Solicitudes por Mes' },
        },
        scales: {
            x: { title: { display: true, text: 'Mes' } },
            y: {
                title: { display: true, text: 'Cantidad de Solicitudes' },
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
            title="Reporte de Solicitudes por Mes"
            bordered
            style={{
                maxWidth: '100%',
                margin: '20px auto',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                borderRadius: '8px',
            }}
        >
            <Space
                direction="horizontal"
                style={{
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'center',
                    flexWrap: 'wrap', // Allow wrapping on smaller screens
                    gap: '16px',
                }}
            >
                <MonthPicker
                    format="MMMM YYYY"
                    onChange={handleStartMonthChange}
                    placeholder="Seleccionar mes de inicio"
                    style={{ minWidth: '200px' }} // Adjust width for responsiveness
                />
                <MonthPicker
                    format="MMMM YYYY"
                    onChange={handleEndMonthChange}
                    placeholder="Seleccionar mes de fin"
                    style={{ minWidth: '200px' }} // Adjust width for responsiveness
                />
            </Space>
            {chartData ? (
                <div style={{ width: '100%', height: '400px' }}> {/* Container for the chart */}
                    <Chart type="line" data={chartData} options={chartOptions} style={{ height: '100%', width: '100%' }} />
                </div>
            ) : (
                <div>No hay datos disponibles para mostrar.</div>
            )}
        </Card>
    );
}
