import React, { useMemo, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Spin, Card, Space, DatePicker } from 'antd';
import { useGetProformasQuery } from '../../features/Proforma/ProformaApiSlice';

const { MonthPicker } = DatePicker;

export default function ReporteGananciaMensual() {
    const { data: proformas, isLoading, isError, error } = useGetProformasQuery();

    // Set the initial month range
    const today = new Date();
    const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1); // First day of the next month

    const [startMonth, setStartMonth] = useState(currentMonth); // Start month
    const [endMonth, setEndMonth] = useState(new Date(nextMonth.getFullYear(), nextMonth.getMonth() + 1, 0)); // End month

    // Handle changes to the start month
    const handleStartMonthChange = (date) => {
        if (date) {
            setStartMonth(new Date(date.year(), date.month(), 1)); // Set to the first day of the selected month
        } else {
            setStartMonth(null); // Reset if no date is selected
        }
    };

    // Handle changes to the end month
    const handleEndMonthChange = (date) => {
        if (date) {
            setEndMonth(new Date(date.year(), date.month() + 1, 0)); // Set to the last day of the selected month
        } else {
            setEndMonth(null); // Reset if no date is selected
        }
    };

    // Filter the proformas based on the selected month range
    const filteredProformas = useMemo(() => {
        if (!proformas || !startMonth || !endMonth) return [];

        return proformas.filter((proforma) => {
            const creationDate = new Date(proforma.fechacreacion); // Use the `fechacreacion` field for filtering
            return (
                proforma.estado === 'Finalizada' && // Include only finalized proformas
                creationDate >= startMonth &&
                creationDate <= endMonth
            );
        });
    }, [proformas, startMonth, endMonth]);

    // Generate the chart data based on the filtered proformas
    const chartData = useMemo(() => {
        if (!filteredProformas.length) return null;

        const gananciasPorMes = filteredProformas.reduce((acc, proforma) => {
            const creationDate = new Date(proforma.fechacreacion);
            const mesAnio = `${creationDate.toLocaleString('default', { month: 'long' })} ${creationDate.getFullYear()}`;
            acc[mesAnio] = (acc[mesAnio] || 0) + parseFloat(proforma.total || 0);
            return acc;
        }, {});

        return {
            labels: Object.keys(gananciasPorMes), // Months as labels
            datasets: [
                {
                    label: 'Ganancia Mensual',
                    data: Object.values(gananciasPorMes), // Monthly earnings
                    backgroundColor: '#42A5F5',
                    borderColor: '#1E88E5',
                    borderWidth: 1,
                },
            ],
        };
    }, [filteredProformas]);

    // Chart options
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // Hide legend for simplicity
            },
            tooltip: {
                callbacks: {
                    label: (context) => `₡ ${new Intl.NumberFormat('en-US').format(context.raw)}`, // Format tooltip in currency
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Mes',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Ganancia (₡)',
                },
                beginAtZero: true,
            },
        },
    };

    if (isLoading) {
        return <Spin tip="Cargando datos..." />;
    }

    if (isError) {
        return <div>Error al cargar las proformas: {error?.data?.error || 'Unknown error'}</div>;
    }

    return (
        <Card
            title="Ganancia Mensual"
            bordered
            style={{
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                padding: '20px',
                margin: '10px auto',
                maxWidth: '100%',
            }}
        >
            <Space
                direction="horizontal"
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    gap: '16px',
                    flexWrap: 'wrap',
                }}
            >
                <MonthPicker
                    format="MMMM YYYY"
                    onChange={handleStartMonthChange}
                    placeholder="Seleccionar mes de inicio"
                    style={{ minWidth: '200px' }}
                />
                <MonthPicker
                    format="MMMM YYYY"
                    onChange={handleEndMonthChange}
                    placeholder="Seleccionar mes de fin"
                    style={{ minWidth: '200px' }}
                />
            </Space>
            {chartData ? (
                <div > {/* Container for the chart */} 
                    <Chart type="bar" data={chartData} options={chartOptions} />
                </div>
            ) : (
                <div>No hay datos disponibles para mostrar.</div>
            )}
        </Card>
    );
}
