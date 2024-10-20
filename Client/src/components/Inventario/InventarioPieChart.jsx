import React, { useMemo } from 'react';
import { Chart } from 'primereact/chart';

const InventarioPieChart = ({ productos = [] }) => {
    // Extract and filter products with quantity <= 10 from all inventories
    const productsWithMinQuantity = useMemo(() => {
        const allProducts = productos.flatMap(inventario => 
            inventario.productos.map(product => ({
                ...product,
                inventoryName: inventario.nombre_inventario // Attach inventory name to each product
            }))
        );
        return allProducts.filter(product => parseFloat(product.cantidad) <= 10);
    }, [productos]);

    console.log(productsWithMinQuantity);

    // Prepare data for the pie chart
    const chartData = {
        labels: productsWithMinQuantity.map(
            product => `${product.nombre_producto} (${product.inventoryName})`
        ),
        datasets: [
            {
                data: productsWithMinQuantity.map(product => parseFloat(product.cantidad)),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800'],
                hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#FF9800']
            }
        ]
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'right'
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}`;
                    }
                }
            }
        },
        maintainAspectRatio: false, // Allows flexibility in height and width
        responsive: true
    };

    // Display a message if no products meet the condition
    if (productsWithMinQuantity.length === 0) {
        return <p>No products with quantity ≤ 10.</p>;
    }

    return (
        <div className="chart-container">
            <Chart type="pie" data={chartData} options={chartOptions} className='pie-inventario-cantmin' />
        </div>
    );
};

export default InventarioPieChart;
