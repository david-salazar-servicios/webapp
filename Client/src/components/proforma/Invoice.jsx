import React, { useState, useEffect } from 'react';
import { Table, Checkbox, Input, Button, Space, Card , Select} from 'antd';
import { useGetSolicitudesQuery, useGetSolicitudByIdQuery, } from '../../features/RequestService/RequestServiceApiSlice';
import { useGetInventariosProductosQuery, useGetInventariosQuery } from '../../features/Inventario/InventarioApiSlice';
import logo from '../../assets/images/Logo-removebg-preview.png';
import { DeleteOutlined,SearchOutlined,CheckOutlined } from '@ant-design/icons';

export default function Invoice() {
    const { data: solicitudes, isLoading: isSolicitudesLoading, isError: isSolicitudesError } = useGetSolicitudesQuery();
    const [selectedSolicitudId, setSelectedSolicitudId] = useState('');
    const [selectedDetalles, setSelectedDetalles] = useState({});
    const [newDetalles, setNewDetalles] = useState([]);
    const [selectedInventario, setSelectedInventario] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const { data: solicitudDetails, refetch } = useGetSolicitudByIdQuery(selectedSolicitudId, { skip: !selectedSolicitudId });
    const { data: inventarios } = useGetInventariosQuery();
    const { data: inventariosProductos } = useGetInventariosProductosQuery();

    const handleSolicitudChange = (event) => setSelectedSolicitudId(event.target.value);

    useEffect(() => {
        if (selectedSolicitudId) refetch();
    }, [selectedSolicitudId, refetch]);

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

    const handleAddRow = () => {
        setNewDetalles((prev) => [...prev, { key: prev.length, detalle: '' }]);
    };

    const handleNewDetalleChange = (index, value) => {
        const updatedDetalles = [...newDetalles];
        updatedDetalles[index].detalle = value;
        setNewDetalles(updatedDetalles);
    };

    const handleDeleteRow = (index) => {
        const updatedDetalles = newDetalles.filter((_, i) => i !== index);
        setNewDetalles(updatedDetalles);
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

    const handleInventarioChange = (value) => setSelectedInventario(value);

    const filteredProducts = inventariosProductos
        ?.filter((item) => item.nombre_inventario === selectedInventario)
        .flatMap((inventario) => inventario.productos)
        .filter((producto) => {
            const nombre = producto?.nombre_producto?.toLowerCase() || '';
            const codigo = producto?.codigo_producto || '';
            return nombre.includes(searchTerm.toLowerCase()) || codigo.includes(searchTerm);
        });

    const handleAddProduct = (product) => {
        if (selectedProducts.some((p) => p.codigo_producto === product.codigo_producto)) {
            message.warning('Este producto ya está agregado.');
            return;
        }
        setSelectedProducts([...selectedProducts, { ...product, cantidad: 1 }]);
    };

    const handleDeleteProduct = (index) => {
        setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
    };

    const columns_proforma = [
        { title: 'L', render: (_, __, index) => index + 1 },
        { title: 'COD', dataIndex: 'codigo_producto' },
        { title: 'DESCRIPCIÓN', dataIndex: 'nombre_producto' },
        {
            title: 'CANT.',
            render: (_, record, index) => (
                <Input
                    type="number"
                    min={1}
                    value={record.cantidad}
                    onChange={(e) => {
                        const updatedProducts = [...selectedProducts];
                        updatedProducts[index].cantidad = e.target.value;
                        setSelectedProducts(updatedProducts);
                    }}
                />
            ),
        },
        { title: 'Unidad Medida', dataIndex: 'unidad_medida' },
        { title: 'PRECIO', dataIndex: 'precio' },
        { title: 'EXENTO', dataIndex: 'exento' },
        { title: 'I.V 13%', dataIndex: 'impuesto' },
        { title: 'TOTAL', dataIndex: 'total' },
        {
            title: 'Acciones',
            render: (_, __, index) => (
                <Button
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteProduct(index)}
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

                

                {/* Información del Cliente */}
                <Card className="mb-4" title="Información del Cliente">
                    <div className="d-flex justify-content-between">
                        <span><strong>Nombre:</strong> {solicitudDetails?.nombre} {solicitudDetails?.apellido}</span>
                        <span><strong>Teléfono:</strong> {solicitudDetails?.telefono}</span>
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
                            onClick={handleAddRow}
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
                                    onChange={(e) => handleNewDetalleChange(index, e.target.value)}
                                    style={{ flex: 1, marginRight: '8px' }}
                                />
                                <Button
                                    danger
                                    icon={<DeleteOutlined />}
                                    onClick={() => handleDeleteRow(index)}
                                />
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Detalle Proforma */}
                <Card className="mb-4" title="Detalle Proforma">
                    <Space style={{ marginBottom: 16 }}>
                        <Select
                            placeholder="Seleccionar Inventario"
                            onChange={handleInventarioChange}
                            options={inventarios?.map((inv) => ({
                                value: inv.nombre_inventario,
                                label: inv.nombre_inventario,
                            }))}
                        />
                        <Input
                            placeholder="Buscar por nombre o código"
                            prefix={<SearchOutlined />}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </Space>

                    <Table
                        dataSource={filteredProducts}
                        columns={[
                            { title: 'Código', dataIndex: 'codigo_producto' },
                            { title: 'Nombre', dataIndex: 'nombre_producto' },
                           
                            {
                                title: 'Acciones',
                                render: (_, product) => (
                                    <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => handleAddProduct(product)}
                    disabled={selectedProducts.some((p) => p.codigo_producto === product.codigo_producto)}
                />
                                ),
                            },
                        ]}
                        pagination={false}
                    />

                    <Table
                        dataSource={selectedProducts}
                        columns={columns_proforma}
                        pagination={false}
                    />
                </Card>

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
