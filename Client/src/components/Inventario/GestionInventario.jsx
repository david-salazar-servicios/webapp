import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'antd';
import { useGetInventariosProductosQuery, useGetInventariosQuery } from '../../features/Inventario/InventarioApiSlice';
import GestionInventarioTable from './GestionInventarioTable'; 
import GestionInventarioCard from './GestionInventarioCard'; 
import Catalogo from './Catalogo';

const GestionInventario = () => {
    const [selectedBodega, setSelectedBodega] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const { data: inventariosProductos, refetch: refetchProductos, isSuccess: isProductosSuccess } = useGetInventariosProductosQuery();
    const { data: inventarios, refetch: refetchInventarios, isSuccess: isInventariosSuccess } = useGetInventariosQuery();

    // Ensure selectedBodega is updated when inventories load successfully
    useEffect(() => {
        if (isProductosSuccess && isInventariosSuccess && inventarios.length > 0) {
            refetchProductos();
            setSelectedBodega((prev) =>
                prev || inventarios[0].nombre_inventario
            );
        }
    }, [isInventariosSuccess, inventarios, isProductosSuccess, inventariosProductos]);



    const handleProductChange = () => {
        refetchProductos(); // Refetch productos when product is added, updated, or deleted
        refetchInventarios(); // Optionally refetch inventarios
    };

    const handleCardClick = (nombre_inventario) => {
        if (nombre_inventario === 'Catalogo') {
            setIsModalVisible(true);
        } else {
            setSelectedBodega(nombre_inventario);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        handleProductChange(); // Refetch data when modal is closed
    };

    const handleInputChange = (key, value) => {
        const updatedData = inventariosProductos.map((item) => {
            if (item.key === key) {
                return { ...item, cantidad: value };
            }
            return item;
        });
        // Logic to update API here if needed
    };

    const filteredData = selectedBodega
        ? inventariosProductos?.filter((inventario) => inventario.nombre_inventario === selectedBodega)
        : [];

    const enhancedInventarios = [
        { nombre_inventario: 'Catalogo' },
        ...(inventarios || []),
    ];

    return (
        <div className="gestion-inventario-container">
            {/* GestionInventarioCard component with enhanced inventories */}
            <GestionInventarioCard 
                inventarios={enhancedInventarios} 
                handleCardClick={handleCardClick} 
            />

            {/* Render the GestionInventarioTable based on selected Bodega */}
            {selectedBodega && isProductosSuccess && selectedBodega !== 'Catalogo' && (
                <GestionInventarioTable 
                    data={filteredData[0]?.productos || []} 
                    handleInputChange={handleInputChange} 
                />
            )}

            {/* Modal for Catalogo */}
            <Modal
                title="Catálogo de Productos"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button key="close" onClick={handleCancel}>
                        Cerrar
                    </Button>,
                ]}
                width={1000}
            >
                <Catalogo productos={inventariosProductos} onProductChange={handleProductChange} />
            </Modal>
        </div>
    );
};

export default GestionInventario;
