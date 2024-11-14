
import React, { useState, useEffect } from 'react';
import { Table, Checkbox, Input, Button, Space, Card, Select, message } from 'antd';
import { useGetSolicitudesQuery, useGetSolicitudByIdQuery } from '../../features/RequestService/RequestServiceApiSlice';
import { useGetCuentasIbanQuery } from '../../features/Cuentaiban/CuentaibanApiSlice';
import logo from '../../assets/images/Logo-removebg-preview.png';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import CatalogoDialog from '../proforma/CatalogoDialog'; // Adjust the import path as necessary

export default function Invoice() {
    const { data: solicitudes, isLoading: isSolicitudesLoading, isError: isSolicitudesError } = useGetSolicitudesQuery();
    const [selectedSolicitudId, setSelectedSolicitudId] = useState('');
    const [selectedDetalles, setSelectedDetalles] = useState({});
    const [newDetalles, setNewDetalles] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showCatalog, setShowCatalog] = useState(false);
    const { data: solicitudDetails, refetch } = useGetSolicitudByIdQuery(selectedSolicitudId, { skip: !selectedSolicitudId });
    const { data: cuentasIban = [], isLoading: isCuentasIbanLoading } = useGetCuentasIbanQuery();

    useEffect(() => {
        if (selectedSolicitudId) refetch();
    }, [selectedSolicitudId, refetch]);

    const handleSolicitudChange = (event) => setSelectedSolicitudId(event.target.value);

    const handleCheckboxChange = (servicioId, detalle) => {
        setSelectedDetalles((prevState) => {
            const currentService = prevState[servicioId] || [];
            const isChecked = currentService.includes(detalle);
            return {
                ...prevState,
                [servicioId]: isChecked
                    ? currentService.filter((d) => d !== detalle)
                    : [...currentService, detalle],
            };
        });
    };


    const updateSelectedProducts = (products, deselectedProducts = []) => {
        setSelectedProducts((prevSelectedProducts) => {
            const filteredProducts = prevSelectedProducts.filter(
                (prevProduct) =>
                    !deselectedProducts.some(
                        (deselected) =>
                            deselected.codigo_producto === prevProduct.codigo_producto &&
                            deselected.inventarioId === prevProduct.inventarioId
                    )
            );

            const newProducts = products.filter(
                (np) =>
                    !filteredProducts.some(
                        (p) => p.codigo_producto === np.codigo_producto && p.inventarioId === np.inventarioId
                    )
            );

            return [...filteredProducts, ...newProducts];
        });
    };

    

    const handleDeleteProduct = (product) => {
        setSelectedProducts((prev) =>
            prev.filter(
                (p) =>
                    p.codigo_producto !== product.codigo_producto ||
                    p.inventarioId !== product.inventarioId // Ensures only the specific inventory product is deleted
            )
        );
    };


    const columns_servicio = [
        {
            title: 'Servicio',
            dataIndex: 'servicio_nombre',
            key: 'servicio_nombre',
        },
        {
            title: 'Detalles',
            dataIndex: 'detalles',
            key: 'detalles',
            render: (detalles, record) => (
                <Space direction="vertical">
                    {detalles.map((detalle, i) => (
                        <Checkbox
                            key={i}
                            checked={selectedDetalles[record.id_servicio]?.includes(detalle) || false}
                            onChange={() => handleCheckboxChange(record.id_servicio, detalle)}
                        >
                            {detalle}
                        </Checkbox>
                    ))}
                </Space>
            ),
        },
    ];

    const columns_proforma = [
        { title: 'L', render: (_, __, index) => index + 1 },
        { title: 'COD', dataIndex: 'codigo_producto' },
        { title: 'DESCRIPCIÓN', dataIndex: 'nombre_producto' },
        { title: 'Inventario', dataIndex: 'inventoryName' },
        {
            title: 'CANT.',
            render: (_, record, index) => (
                <Input
                    type="number"
                    min={1}
                    value={record.cantidad || 1}
                    onChange={(e) => {
                        const updatedProducts = [...selectedProducts];
                        updatedProducts[index].cantidad = parseInt(e.target.value, 10);
                        setSelectedProducts(updatedProducts);
                    }}
                    style={{
                        width: '100px',
                        border: 'none',
                        borderBottom: '1px solid #d9d9d9',
                        borderRadius: 0,
                        padding: '0 4px',
                        textAlign: 'center'
                    }}
                />
            ),
        },
        { title: 'Unidad Medida', dataIndex: 'unidad_medida' },
        {
            title: 'PRECIO',
            dataIndex: 'precio_venta',
            render: (text) => <span>₡ {text}</span>
        },
        {
            title: 'EXCEDENTE',
            render: (_, record) => {
                const excedente = (record.precio_venta || 0) * (record.cantidad || 0);
                return <span>₡ {excedente.toFixed(2)}</span>;
            },
        },
        {
            title: 'I.V 13%',
            render: (_, record) => {
                const excedente = (record.precio_venta || 0) * (record.cantidad || 0);
                const impuesto = excedente * 0.13;
                return <span>₡ {impuesto.toFixed(2)}</span>;
            },
        },
        {
            title: 'TOTAL',
            render: (_, record) => {
                const excedente = (record.precio_venta || 0) * (record.cantidad || 0);
                const impuesto = excedente * 0.13;
                const total = excedente + impuesto;
                return <span>₡ {total.toFixed(2)}</span>;
            },
        },
        {
            title: 'Acciones',
            render: (_, record) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteProduct(record)}
                />
            ),
        },
    ];



    const todayDate = new Date();
    const formattedDate = `${todayDate.getDate().toString().padStart(2, '0')}-${(todayDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${todayDate.getFullYear()}`;

    if (isSolicitudesLoading) return <p>Loading solicitudes...</p>;
    if (isSolicitudesError) return <p>Error loading solicitudes</p>;


    // Calculate totals
    const sumExcedente = selectedProducts.reduce((sum, product) => {
        const excedente = (product.precio_venta || 0) * (product.cantidad || 0);
        return sum + excedente;
    }, 0);

    const sumIV = sumExcedente * 0.13;
    const totalWithIV = sumExcedente + sumIV;
    return (
        <div className="invoice-1 invoice-wrapper">
            <div className="invoice-container container">
                {/* Header Section */}
                <Card className="mb-4 color-white">
                    <div className="row g-0">
                        <div className="col-sm-4">
                            <div className="invoice-logo">
                                <img src={logo} alt="logo" className="logo" />
                            </div>
                        </div>
                        <div className="col-sm-8 text-right invoice-id p-4">
                            <h2 className='color-white'>Proforma</h2>
                            <h4 className='color-white'>Servicios Residenciales y Comerciales CR LTDA</h4>
                            <div className="d-flex justify-content-end align-items-center gap-4">
                                <div><i className="fa fa-envelope me-2"></i> servicios.rc.cr@gmail.com</div>
                                <div><i className="fa fa-phone me-2"></i> 2239-6042 / 8609-6382</div>
                                <div><i className="fa fa-calendar me-2"></i> <strong>Fecha:</strong> {formattedDate}</div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Solicitud Selection */}
                <Card className="mb-4" title="Seleccionar Solicitud">
                    <select
                        id="solicitudSelect"
                        className="form-control"
                        onChange={handleSolicitudChange}
                        value={selectedSolicitudId}
                    >
                        <option value="">-- Seleccionar Solicitud --</option>
                        {solicitudes?.map((solicitud) => (
                            <option key={solicitud.id_solicitud} value={solicitud.id_solicitud}>
                                {solicitud.id_solicitud} - {solicitud.nombre} {solicitud.apellido}
                            </option>
                        ))}
                    </select>
                </Card>
                {/* Información del Archivo */}
                <Card className="mb-4" title="Información del Archivo">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex flex-column">
                            <strong>Número Archivo:</strong>
                            <Input
                                style={{
                                    width: '150px',
                                    border: 'none',
                                    borderBottom: '1px solid #d9d9d9',
                                    borderRadius: 0,
                                    padding: '0 4px'
                                }}
                            />
                        </div>

                        <div className="d-flex flex-column">
                            <strong>Cotización:</strong>
                            <Input
                                style={{
                                    width: '150px',
                                    border: 'none',
                                    borderBottom: '1px solid #d9d9d9',
                                    borderRadius: 0,
                                    padding: '0 4px'
                                }}
                            />
                        </div>

                        <div className="d-flex flex-column">
                            <strong>NC/F-E:</strong>
                            <Input
                                style={{
                                    width: '150px',
                                    border: 'none',
                                    borderBottom: '1px solid #d9d9d9',
                                    borderRadius: 0,
                                    padding: '0 4px'
                                }}
                            />
                        </div>

                        <div className="d-flex flex-column">
                            <strong>Oferta Válida:</strong>
                            <Input
                                style={{
                                    width: '150px',
                                    border: 'none',
                                    borderBottom: '1px solid #d9d9d9',
                                    borderRadius: 0,
                                    padding: '0 4px'
                                }}
                            />
                        </div>
                    </div>
                </Card>
                {/* Información del Cliente */}
                <Card className="mb-4" title="Información del Cliente">
                    <div className="d-flex justify-content-between">
                        <span><strong>Nombre:</strong> {solicitudDetails?.nombre} {solicitudDetails?.apellido}</span>
                        <span><strong>Teléfono Móvil:</strong> {solicitudDetails?.telefono}</span>
                        <span><strong>Teléfono Fijo:</strong> {solicitudDetails?.telefono_fijo}</span>
                        <span><strong>Email:</strong> {solicitudDetails?.correo_electronico}</span>
                        <span><strong>Dirección:</strong> {solicitudDetails?.direccion || '-'}</span>
                    </div>
                </Card>

                {/* Información de Servicio(s) */}
                <Card className="mb-4" title="Información de Servicio(s)">
                    <Table
                        columns={columns_servicio}
                        dataSource={solicitudDetails?.servicios || []}
                        pagination={false}
                        rowKey="id_servicio"
                    />
                    <div className="d-flex align-items-center mt-2">
                        <Button
                            type="primary"
                            onClick={() => setNewDetalles([...newDetalles, { key: newDetalles.length, detalle: '' }])}
                            style={{ marginRight: '8px' }}
                        >
                            Añadir Detalle
                        </Button>
                    </div>

                    <div className="mt-4">
                        {newDetalles.map((detalle, index) => (
                            <div key={index} className="d-flex mb-2">
                                <Input
                                    placeholder={`Nuevo Detalle`}
                                    value={detalle.detalle}
                                    onChange={(e) => {
                                        const updatedDetalles = [...newDetalles];
                                        updatedDetalles[index].detalle = e.target.value;
                                        setNewDetalles(updatedDetalles);
                                    }}
                                    style={{ flex: 1, marginRight: '8px' }}
                                />
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => setNewDetalles(newDetalles.filter((_, i) => i !== index))}
                                />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Detalle Proforma */}
                <Card className="mb-4" title="Detalle Proforma">
                    <Space style={{ marginBottom: 16 }}>
                        <Button type="primary" onClick={() => setShowCatalog(true)}>
                            Abrir Catálogo
                        </Button>
                    </Space>

                    <Table
                        dataSource={selectedProducts}
                        columns={columns_proforma}
                        pagination={false} // Disable pagination
                        rowKey={(record) => `${record.codigo_producto}-${record.inventarioId}`} // Unique key
                        style={{ marginBottom: 0 }} // Removes any potential margin at the bottom
                    />


                    {/* Modal for Producto Catalog */}
                    <CatalogoDialog
                        visible={showCatalog}
                        onHide={() => setShowCatalog(false)}
                        onSelectProduct={updateSelectedProducts}
                        selectedProducts={selectedProducts}
                    />

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginTop: '16px' }}>
                        {/* Notas Card */}
                        <Card
                            className="mb-4"
                            title="Notas"
                            style={{ flex: '1 1 45%', maxWidth: '100%' }}
                        >
                            <textarea
                                placeholder="Escribe tus notas aquí..."
                                style={{
                                    width: '100%',
                                    height: '35px',
                                    border: '1px solid #d9d9d9',
                                    borderRadius: '4px',
                                    padding: '8px'
                                }}
                            />
                        </Card>

                        {/* Totales Card in row format */}
                        <Card
                            className="mb-4"
                            title="TOTALES"
                            style={{
                                flex: '1 1 45%',
                                maxWidth: '100%',
                                height: '120px', // Fixed height
                                overflow: 'hidden' // Prevent overflow to maintain fixed height
                            }}
                            headStyle={{ backgroundColor: '#fafafa' }}
                        >
                            <div className="totals-container" style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', height: '100%' }}>
                                <div><strong>SUBTOTAL:</strong> ₡ {sumExcedente.toFixed(2)}</div>
                                <div><strong>I.V 13%:</strong> ₡ {sumIV.toFixed(2)}</div>
                                <div><strong>TOTAL:</strong> ₡ {totalWithIV.toFixed(2)}</div>
                            </div>
                        </Card>
                    </div>
                </Card>






                <Card className="mb-4" title="Cuentas Bancarias">
                    {isCuentasIbanLoading ? (
                        <p>Loading cuentas bancarias...</p>
                    ) : (
                        <>
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>IBAN</th>
                                        <th>Banco</th>
                                        <th>Moneda</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cuentasIban.map((cuenta) => (
                                        <tr key={cuenta.id_cuenta}>
                                            <td><strong>{cuenta.id_iban}</strong></td>
                                            <td>{cuenta.tipobanco}</td>
                                            <td>{cuenta.moneda}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="sinpe-movil-info mt-3" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <h5>SINPEMOVIL:</h5>
                                <h5 style={{ fontSize: '18px' }}><strong>88206326</strong> - Mariela Mejías M</h5>
                            </div>

                        </>
                    )}
                </Card>

                <footer style={{ marginTop: '20px', padding: '10px', borderTop: '1px solid #d9d9d9', fontSize: '14px', color: '#555' }}>
                    <p>
                        Venta y entrega de materiales solo de contado o hecho efectivo el pago en nuestra cuenta,
                        entrega de materiales de 1 a 4 días hábiles de lunes a viernes de 08:00 AM a 05:00 PM.
                    </p>
                    <p>
                        Devolución de materiales no electrónicos tiene un cargo del 10% sobre el monto cancelado,
                        NO se recibe el material usado.
                    </p>
                    <p>Materiales electrónicos no aceptamos devoluciones solo por
                        defecto de fábrica dentro de la garantía.
                    </p>
                    <p>Instalación de sistemas de riego u otros trabajos sujeto a mutuo acuerdo para ingresar al proyecto.</p>
                </footer>

                {/* Buttons Section */}
                <div className="text-center mt-4">
                    <button onClick={() => window.print()} className="btn btn-lg btn-print">
                        <i className="fa fa-print"></i> Imprimir Factura
                    </button>
                    <button className="btn btn-lg btn-download btn-theme">
                        <i className="fa fa-download"></i> Descargar Factura
                    </button>
                </div>

            </div>
        </div>
    );
}

