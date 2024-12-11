
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Checkbox, Input, Button, Space, Card, Select, message, Modal } from 'antd';
import { useGetSolicitudesQuery, useGetSolicitudByIdQuery } from '../../features/RequestService/RequestServiceApiSlice';
import { useGetCuentasIbanQuery } from '../../features/Cuentaiban/CuentaibanApiSlice';
import { useCreateProformaMutation, useGetProformaByIdQuery, useUpdateProformaMutation, useFinalizarProformaMutation, useDeleteProformaMutation } from '../../features/Proforma/ProformaApiSlice';
import { useLocation } from 'react-router-dom';
import logo from '../../assets/images/Logo-removebg-preview.png';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import CatalogoDialog from './CatalogoDialog'; // Adjust the import path as necessary


// Define global print-specific styles
const printStyles = `
  @media print {
  /* Hide input placeholders in print */
    input::placeholder {
      color: transparent !important; /* Makes placeholder text invisible */
    }

    textarea::placeholder {
      color: transparent !important; /* Applies to textareas as well */
    }

 .title-card {
    display: none !important;
  }

    /* Hide all interactive elements: buttons, checkboxes for sinIVA and sinDetalle */
    button, .btn, .btn-print, .btn-download, #solicitudSelect, .ant-checkbox-wrapper {
      display: none !important;
    }

    .ant-layout-sider, /* Adjust based on your layout's sidebar class */
    .sidebar, 
    .ant-layout-sider-children {
      display: none !important;
      width: 0 !important;
      max-width: 0 !important;
    }

    /* Specifically hide sinIVA and sinDetalle checkboxes */
    .sinIVA-checkbox, .sinDetalle-checkbox {
      display: none !important;
    }

    /* Show "Detalle Servicios" checkboxes */
    .detalles-checkbox {
      display: inline-block !important;
    }

    /* Hide interactive table and show print-specific table */
    .interactive-table {
      display: none !important;
    }

    .print-table {
      display: block !important;
    }

    /* Add bullets to the detalles column in print-table */
    .print-table ul {
      list-style: disc inside; /* Bullets inside the column */
      margin: 0;
      padding: 0;
    }

    .print-table ul li {
      margin: 4px 0; /* Add space between items */
    }

    /* Hide the "Acciones", "Inventario", and "Código" columns in all tables */
    .acciones-column, 
    .codigo-column, 
    .inventario-column {
      display: none !important;
    }

    /* Ensure layout fits the page */
    .invoice-wrapper {
      width: 100%;
    }

    /* General adjustments for print */
    body {
      margin: 0;
      padding: 0;
    }
  }

  @media screen {
    /* Interactive table visible during normal use */
    .interactive-table {
      display: block;
    }

    /* Print-specific table hidden during normal use */
    .print-table {
      display: none;
    }
  }
`;


// Inject the print-specific styles into the document
const injectPrintStyles = () => {
    const styleTag = document.createElement('style');
    styleTag.textContent = printStyles;
    document.head.appendChild(styleTag);
};

// Call the function to inject styles
injectPrintStyles();

export default function Proforma() {
    const { data: solicitudes, isLoading: isSolicitudesLoading, isError: isSolicitudesError } = useGetSolicitudesQuery();
    const [selectedSolicitudId, setSelectedSolicitudId] = useState('');
    const [selectedDetalles, setSelectedDetalles] = useState({});
    const [newDetalles, setNewDetalles] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showCatalog, setShowCatalog] = useState(false);
    const { data: solicitudDetails, refetch } = useGetSolicitudByIdQuery(selectedSolicitudId, { skip: !selectedSolicitudId });
    const { data: cuentasIban = [], isLoading: isCuentasIbanLoading } = useGetCuentasIbanQuery();
    const uniqueKeyCounter = useRef(1);
    const [sinIVA, setSinIVA] = useState(false); // State for "Sin IVA" checkbox
    const [sinDetalle, setSinDetalle] = useState(false); // State for "Sin Detalle" checkbox
    const [numeroArchivo, setNumeroArchivo] = useState('');
    const [cotizacion, setCotizacion] = useState('');
    const [ncFe, setNcFe] = useState('');
    const [ofertaValida, setOfertaValida] = useState('');
    const [notas, setNotas] = useState("")
    const navigate = useNavigate()
    const [createProforma, { isLoading: isCreating, isError: hasCreateError, error: createError }] = useCreateProformaMutation();
    const [updateProforma, { isLoading: isUpdating }] = useUpdateProformaMutation();
    const [finalizarProforma, { isLoading }] = useFinalizarProformaMutation();
    const [deleteProforma, { isLoading: isDeleting }] = useDeleteProformaMutation();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
    const { id_proforma } = useParams(); // Get the proforma ID from the URL
    const isEditing = !!id_proforma; // Determine if editing or creating    
    const location = useLocation();
    const proformaList = Array.isArray(location.state?.proformaList) ? location.state.proformaList : [];
    const { data: proformaData, isSuccess: proformaLoaded } = useGetProformaByIdQuery(
        id_proforma,
        { skip: !isEditing } // Only fetch if editing
    );

    useEffect(() => {
        if (proformaList.length) {
            console.log("Complete Proformas List:", proformaList);

        }
    }, [proformaList]);

    useEffect(() => {
        if (isEditing && proformaLoaded) {
            const { proforma } = proformaData;
            // Set the selected solicitud ID based on proforma
            setSelectedSolicitudId(proforma.id_solicitud || '');
        }
    }, [isEditing, proformaLoaded, proformaData]);

    useEffect(() => {
        if (isEditing && proformaLoaded) {
            // Populate Proforma data
            const { proforma, productos, productosAdicionales, servicios, serviciosAdicionales } =
                proformaData;

            setNumeroArchivo(proforma.numeroarchivo || "");
            setCotizacion(proforma.numerocotizacion || "");
            setNcFe(proforma.nc_fe || "");
            setOfertaValida(proforma.oferta_valida || "");
            setNotas(proforma.notas || "");
            setSinIVA(proforma.siniva || false);

            // Populate Productos
            setSelectedProducts(
                productos.map((p) => ({
                    id_producto: p.id_producto,
                    codigo_producto: p.codigo_producto,
                    nombre_producto: p.descripcion,
                    inventarioId: p.id_inventario,
                    inventoryName: p.inventario_nombre,
                    cantidad: parseFloat(p.cantidad) || 1,
                    unidad_medida: p.unidad_medida,
                    precio_venta: parseFloat(p.precio),
                }))
            );

            // Populate Productos Adicionales
            setExtraDetails(
                productosAdicionales.map((p) => ({
                    key: p.id_detalle_proforma,
                    nombre_producto: p.descripcion,
                    precio_venta: parseFloat(p.precio),
                    excedente: parseFloat(p.excedente),
                    impuesto: parseFloat(p.iva),
                    total: parseFloat(p.total),
                }))
            );

            // Map Servicios Detalles
            const detallesMap = {};
            servicios.forEach((s) => {
                if (!detallesMap[s.id_servicio]) {
                    detallesMap[s.id_servicio] = [];
                }
                detallesMap[s.id_servicio].push(s.detalle);
            });
            setSelectedDetalles(detallesMap);

            // Populate Servicios Adicionales
            setNewDetalles(
                serviciosAdicionales.map((sa) => ({
                    key: sa.id_servicios_proforma,
                    detalle: sa.detalle,
                }))
            );
        }
    }, [isEditing, proformaLoaded, proformaData]);

    useEffect(() => {
        if (isEditing) {
            console.log(`Editing Proforma with ID: ${id_proforma}`);
            // Fetch data for the proforma
        } else {
            console.log('Creating a new Proforma');
            // Initialize creation-specific logic
        }
    }, [isEditing, id_proforma]);

    useEffect(() => {
        if (selectedSolicitudId) {
            refetch();
        }
    }, [selectedSolicitudId, refetch]);

    const proformaEstado = proformaData?.proforma?.estado;
    const isFinalized = proformaEstado === "Finalizada";

    const formatWithCommas = (number) => {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
    };


    const handleFinalizeProforma = async () => {
        try {
            // Step 1: Build the request body for the update
            const body = buildRequestBody();

            // Step 2: Trigger the update
            await updateProforma({ id: id_proforma, updatedProforma: body }).unwrap();


            // Step 3: Call finalize method
            const response = await finalizarProforma(id_proforma).unwrap();

            // Notify success and navigate to the list of proformas
            message.success(response.message || "Proforma finalizada con éxito.");
            navigate("/mantenimiento/proformas");
        } catch (error) {
            // Handle errors for both update and finalize
            message.error(error.data?.message || "Error al finalizar la proforma.");
            console.error("Error in finalizing proforma:", error);
        } finally {
            // Hide modal after processing
            setIsModalVisible(false);
        }
    };


    // Handle delete proforma
    const handleDeleteProforma = async () => {
        try {
            await deleteProforma(id_proforma).unwrap(); // Trigger the delete mutation
            message.success("Proforma eliminada con éxito.");
            navigate("/mantenimiento/proformas"); // Navigate to the proformas list after deletion
        } catch (error) {
            message.error(error.data?.message || "Error al eliminar la proforma.");
        } finally {
            setIsDeleteModalVisible(false); // Close the confirmation dialog
        }
    };

    const handleSolicitudChange = (event) => {
        const newSolicitudId = event.target.value;

        setSelectedSolicitudId(newSolicitudId);
        setSelectedDetalles({}); // Clear all previously selected detalles
    };

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

    const [extraDetails, setExtraDetails] = useState([
        {
            key: uniqueKeyCounter.current++, // Unique key for "Visita"
            nombre_producto: 'Visita',
            precio_venta: 0,
            excedente: 0,
            impuesto: 0,
            total: 0,
        },
        {
            key: uniqueKeyCounter.current++, // Unique key for "Mano de obra"
            nombre_producto: 'Mano de obra',
            precio_venta: 0,
            excedente: 0,
            impuesto: 0,
            total: 0,
        },

    ]);

    const handleExtraDetailChange = (index, key, value) => {
        setExtraDetails((prevDetails) => {
            const updatedDetails = [...prevDetails];
            const detail = updatedDetails[index];
            detail[key] = value;

            if (key === 'precio_venta') {
                const precio = parseFloat(value) || 0; // Default to 0 if parsing fails
                detail.excedente = precio;
                detail.impuesto = sinIVA ? 0 : precio * 0.13;
                detail.total = precio + detail.impuesto;
            }

            return updatedDetails;
        });
    };


    const handleAddExtraRow = () => {
        setExtraDetails((prevDetails) => [
            ...prevDetails,
            {
                key: uniqueKeyCounter.current++,
                nombre_producto: '',
                precio_venta: 0,
                excedente: 0,
                impuesto: 0,
                total: 0,
            },
        ]);
    };


    const handleDeleteExtraRow = (key) => {
        setExtraDetails((prevDetails) => prevDetails.filter((detail) => detail.key !== key));
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

    const handleSaveProforma = async () => {
        const body = buildRequestBody();
        try {
            if (isEditing) {
                // Update Proforma
                await updateProforma({ id: id_proforma, updatedProforma: body }).unwrap();
                message.success(`Proforma actualizada con éxito!`);
            } else {
                // Create Proforma
                await createProforma(body).unwrap();
                message.success(`Proforma creada con éxito!`);
            }
            navigate('/mantenimiento/proformas');
        } catch (error) {
            message.error(`Error al ${isEditing ? 'actualizar' : 'crear'} la proforma.`);
            console.error(error);
        }
    };

    const extraColumns = [
        { title: 'L', render: (_, __, index) => `${index + 1}` },
        {
            title: 'DESCRIPCIÓN',
            dataIndex: 'nombre_producto',
            render: (_, record, index) => (
                <Input
                    disabled={isFinalized}
                    placeholder="Descripción"
                    value={record.nombre_producto}
                    //disabled={record.key === 'materiales'} // Disable editing for "Materiales"
                    onChange={(e) => handleExtraDetailChange(index, 'nombre_producto', e.target.value)}
                />
            ),
        },
        {
            title: 'PRECIO',
            dataIndex: 'precio_venta',
            render: (_, record, index) => (
                <Input
                    disabled={isFinalized}
                    type="number"
                    min={0}
                    value={record.precio_venta}
                    //disabled={record.key === 'materiales'} // Disable editing for "Materiales"
                    onChange={(e) => handleExtraDetailChange(index, 'precio_venta', e.target.value)}
                    addonBefore="₡" // Adds the colon symbol
                />
            ),
        },
        {
            title: 'I.V 13%',
            dataIndex: 'impuesto',
            render: (_, record) =>
                record.key === 'materiales' ? (
                    <span>₡ {formatWithCommas(record.impuesto)}</span>
                ) : (
                    <span>₡ {formatWithCommas(record.impuesto)}</span>
                ),
        },
        {
            title: 'TOTAL',
            dataIndex: 'total',
            render: (_, record) =>
                record.key === 'materiales' ? (
                    <span>₡ {formatWithCommas(record.total)}</span>
                ) : (
                    <span>₡ {formatWithCommas(record.total)}</span>
                ),
        },
        {
            title: 'Acciones',
            className: 'acciones-column',
            render: (_, record) =>
                !record.isMateriales && (
                    <Button
                        disabled={isFinalized}
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteExtraRow(record.key)}
                    />
                ),
        },
    ];




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
                            disabled={isFinalized}
                            key={i}
                            checked={selectedDetalles[record.id_servicio]?.includes(detalle) || false}
                            onChange={() => handleCheckboxChange(record.id_servicio, detalle)}
                            className="detalles-checkbox"
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
        { title: 'COD', className: 'codigo-column', dataIndex: 'codigo_producto' },
        { title: 'DESCRIPCIÓN', dataIndex: 'nombre_producto' },
        { title: 'Inventario', className: 'inventario-column', dataIndex: 'inventoryName' },
        {
            title: 'CANT.',
            render: (_, record, index) => (
                <Input
                    disabled={isFinalized}
                    type="text" // Use text to avoid the spinner
                    value={record.cantidad || ''} // Default to empty if undefined
                    onKeyPress={(e) => {
                        // Only allow numbers
                        if (!/^\d$/.test(e.key)) {
                            e.preventDefault(); // Prevent the default action if the input is not a digit
                        }
                    }}
                    onChange={(e) => {
                        const value = e.target.value;

                        // Update `cantidad` live
                        const updatedProducts = [...selectedProducts];
                        updatedProducts[index].cantidad = value; // Allow temporary raw value
                        setSelectedProducts(updatedProducts);
                    }}
                    onBlur={(e) => {
                        const value = e.target.value;

                        // Validate and ensure it's a positive integer
                        const validCantidad = Math.max(1, parseInt(value, 10) || 1);

                        // Update `cantidad` with the validated value
                        const updatedProducts = [...selectedProducts];
                        updatedProducts[index].cantidad = validCantidad; // Final sanitized value
                        setSelectedProducts(updatedProducts);
                    }}
                    style={{
                        width: '80px',
                        border: 'none',
                        borderBottom: '1px solid #d9d9d9',
                        borderRadius: 0,
                        padding: '0 4px',
                        textAlign: 'center',
                    }}
                />
            ),
        },
        { title: 'Unidad Medida', dataIndex: 'unidad_medida' },
        {
            title: 'PRECIO',
            dataIndex: 'precio_venta',
            render: (text) => <span>₡ {formatWithCommas(text)}</span>,
        },
        {
            title: 'EXCEDENTE',
            render: (_, record) => {
                const excedente = (record.precio_venta || 0) * (record.cantidad || 0);
                return  <span>₡ {formatWithCommas(excedente)}</span>;
            },
        },
        {
            title: 'I.V 13%',
            render: (_, record) => {
                const excedente = (record.precio_venta || 0) * (record.cantidad || 0);
                const impuesto = excedente * 0.13;
                return  <span>₡ {formatWithCommas(excedente)}</span>;
            },
        },
        {
            title: 'TOTAL',
            render: (_, record) => {
                const excedente = (record.precio_venta || 0) * (record.cantidad || 0);
                const impuesto = excedente * 0.13;
                const total = excedente + impuesto;
                return  <span>₡ {formatWithCommas(excedente)}</span>;
            },
        },
        {
            title: 'Acciones',
            className: 'acciones-column',
            render: (_, record) => (
                <Button
                    disabled={isFinalized}
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleDeleteProduct(record)}
                />
            ),
        },
    ];

    const filteredSolicitudes = solicitudes?.filter((solicitud) => {
        const isSolicitudAssociated = Array.isArray(proformaList) && proformaList.some(
            (proforma) => proforma.id_solicitud === solicitud.id_solicitud
        );
    
        // Exclude solicitudes with estado "Rechazada"
        const isRechazada = solicitud.estado === "Rechazada";
    
        if (isEditing) {
            // Include the current solicitud being edited even if associated
            return (
                (!isSolicitudAssociated || 
                solicitud.id_solicitud === proformaData?.proforma?.id_solicitud) &&
                !isRechazada
            );
        }
    
        // In create mode: only include unassociated and non-"Rechazada" solicitudes
        return !isSolicitudAssociated && !isRechazada;
    }) || [];
    


    const todayDate = new Date();
    const formattedDate = `${todayDate.getDate().toString().padStart(2, '0')}-${(todayDate.getMonth() + 1)
        .toString()
        .padStart(2, '0')}-${todayDate.getFullYear()}`;

    if (isSolicitudesLoading) return <p>Loading solicitudes...</p>;
    if (isSolicitudesError) return <p>Error loading solicitudes</p>;

    const subtotalExtras = extraDetails.reduce(
        (sum, detail) => sum + (parseFloat(detail.precio_venta) || 0), // Default to 0
        0
    );

    const subTotal = selectedProducts.reduce((sum, product) => {
        const excedente = (parseFloat(product.precio_venta) || 0) * (product.cantidad || 0);
        return sum + excedente;
    }, 0);

    const sumExcedente = subTotal + subtotalExtras;
    const totalWithoutIVA = sumExcedente || 0; // Ensure a default number
    const iva = sinIVA ? 0 : totalWithoutIVA * 0.13;
    const totalWithIVA = totalWithoutIVA + iva;

    // Calculate "Materiales" totals
    const materialesExcedente = selectedProducts.reduce((sum, product) => {
        const productExcedente = (parseFloat(product.precio_venta) || 0) * (product.cantidad || 0);
        return sum + productExcedente;
    }, 0);

    const materialesIVA = sinIVA ? 0 : materialesExcedente * 0.13; // Only calculate IVA for selected products
    const materialesTotal = materialesExcedente + materialesIVA;

    // Prepare data with "Materiales" row
    const dataWithMateriales = [
        ...extraDetails,
        {
            key: 'materiales',
            nombre_producto: 'Materiales',
            isMateriales: true, // Marks this as the "Materiales" row
            precio_venta: materialesExcedente, // Subtotal of selected products
            excedente: null,
            impuesto: materialesIVA, // IVA for "Materiales" row
            total: materialesTotal, // Total for "Materiales" row
        },
    ];


    const buildRequestBody = () => {
        // Gather servicios data
        const servicios = (solicitudDetails?.servicios || []).map((servicio) => ({
            id_servicio: servicio.id_servicio,
            servicio_nombre: servicio.servicio_nombre,
            detalles: selectedDetalles[servicio.id_servicio] || [], // Checked details
        }));

        const serviciosAdicionales = newDetalles
            .map((adicional) => adicional.detalle) // Extract detail names
            .filter((adicional) => adicional);

        // Gather solicitud data
        const solicitudData = {
            solicitudId: selectedSolicitudId,
            cliente: {
                nombre: solicitudDetails?.nombre,
                apellido: solicitudDetails?.apellido,
                telefono: solicitudDetails?.telefono,
                telefono_fijo: solicitudDetails?.telefono_fijo,
                email: solicitudDetails?.correo_electronico,
                direccion: solicitudDetails?.direccion,
            },
        };

        // Gather additional "Información del Archivo" data
        const archivoInfo = {
            numeroArchivo,
            cotizacion,
            ncFe,
            ofertaValida,
        };

        // Gather selected product data
        const productos = selectedProducts.map((product) => ({
            productoId: product.id_producto,
            codigo_producto: product.codigo_producto,
            descripcion: product.nombre_producto,
            inventarioId: product.inventarioId,
            inventario_nombre: product.inventoryName,
            cantidad: product.cantidad || 1,
            unidad_medida: product.unidad_medida,
            precio_venta: product.precio_venta,
            excedente: (product.precio_venta || 0) * (product.cantidad || 1),
            iva: sinIVA ? 0 : (product.precio_venta || 0) * (product.cantidad || 1) * 0.13,
            total: sinIVA
                ? (product.precio_venta || 0) * (product.cantidad || 1)
                : (product.precio_venta || 0) * (product.cantidad || 1) * 1.13,
        }));

        // Gather extra detail data
        const productosAdicionales = extraDetails.map((extra) => ({
            descripcion: extra.nombre_producto,
            precio_venta: extra.precio_venta,
            excedente: extra.excedente,
            iva: extra.impuesto,
            total: extra.total,
        }));

        // Calculate totals
        // Round to two decimal places at every step
        const subtotal = productos.reduce((sum, p) => sum + (parseFloat(p.excedente) || 0), 0) +
            productosAdicionales.reduce((sum, e) => sum + (parseFloat(e.precio_venta) || 0), 0);

        const roundedSubtotal = parseFloat(subtotal.toFixed(2)); // Ensure subtotal is rounded to two decimal places

        const totalIVA = sinIVA
            ? 0
            : parseFloat((roundedSubtotal * 0.13).toFixed(2)); // Calculate IVA and round

        const total = parseFloat((roundedSubtotal + totalIVA).toFixed(2)); // Calculate total and round


        // Build the final body
        const requestBody = {
            solicitud: solicitudData,
            archivoInfo, // Include "Información del Archivo"
            servicios, // Include servicios with checked details and adicionales
            serviciosAdicionales,
            productos,
            productosAdicionales,
            totales: {
                subtotal,
                iva: totalIVA,
                total,
            },
            sinIVA,
            sinDetalle,
            notas: document.querySelector('textarea')?.value || '', // Replace with state if binding to a state
            fecha: formattedDate,
        };

        console.log('Request Body:', requestBody); // Debugging purpose
        return requestBody;
    };



    return (
        <div className="invoice-1 invoice-wrapper">

            <Card title={
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} className='title-card'>
                    <h5 style={{ fontSize: '16px', fontWeight: '600' }}>{isEditing ? `Editar Proforma ${id_proforma}` : "Crear Nueva Proforma"}</h5>
                </div>
            }

                bordered={false}
                style={{
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    borderRadius: "5px",
                }}>
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
                    <Card className="mb-4" title="Seleccionar Solicitud" id="solicitudSelect"
                        style={{
                            boxShadow: "0 2px 2px 0 rgba(0,0,0,0.2)",
                        }}>
                        <select
                            id="solicitudSelect"
                            className="form-control"
                            onChange={handleSolicitudChange}
                            value={selectedSolicitudId}
                            disabled={isFinalized}
                        >
                            <option value="">-- Seleccionar Solicitud --</option>
                            {filteredSolicitudes.map((solicitud) => (
                                <option key={solicitud.id_solicitud} value={solicitud.id_solicitud}>
                                    {solicitud.id_solicitud} - {solicitud.nombre} {solicitud.apellido}
                                </option>
                            ))}
                        </select>

                    </Card>
                    {/* Información del Archivo */}
                    <Card className="mb-4" title="Información del Archivo"
                        style={{
                            boxShadow: "0 2px 2px 0 rgba(0,0,0,0.2)",
                        }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex flex-column">
                                <strong>Número Archivo:</strong>
                                <Input
                                    disabled={isFinalized}
                                    value={numeroArchivo} // Bind to state
                                    onChange={(e) => setNumeroArchivo(e.target.value)} // Update state
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
                                    disabled={isFinalized}
                                    value={cotizacion} // Bind to state
                                    onChange={(e) => setCotizacion(e.target.value)} // Update state
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
                                    disabled={isFinalized}
                                    value={ncFe} // Bind to state
                                    onChange={(e) => setNcFe(e.target.value)} // Update state
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
                                    disabled={isFinalized}
                                    value={ofertaValida} // Bind to state
                                    onChange={(e) => setOfertaValida(e.target.value)} // Update state
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
                    <Card className="mb-4" title="Información del Cliente"
                        style={{
                            boxShadow: "0 2px 2px 0 rgba(0,0,0,0.2)",
                        }}>
                        <div className="d-flex justify-content-between">
                            <span><strong>Nombre:</strong> {solicitudDetails?.nombre} {solicitudDetails?.apellido}</span>
                            <span><strong>Teléfono Móvil:</strong> {solicitudDetails?.telefono}</span>
                            <span><strong>Teléfono Fijo:</strong> {solicitudDetails?.telefono_fijo}</span>
                            <span><strong>Email:</strong> {solicitudDetails?.correo_electronico}</span>
                            <span><strong>Dirección:</strong> {solicitudDetails?.direccion || '-'}</span>
                        </div>
                    </Card>

                    {/* Información de Servicio(s) */}
                    <Card className="mb-4" title="Información de Servicio(s)"
                        style={{
                            boxShadow: "0 2px 2px 0 rgba(0,0,0,0.2)",
                        }}>
                        <div className="interactive-table">
                            <Table
                                columns={columns_servicio}
                                dataSource={solicitudDetails?.servicios || []}
                                pagination={false}
                                rowKey="id_servicio"
                            />
                        </div>
                        <div className="print-table">
                            <Table
                                columns={[
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
                                            <ul>
                                                {(selectedDetalles[record.id_servicio] || []).map((detalle, i) => (
                                                    <li key={i}>{detalle}</li>
                                                ))}
                                            </ul>
                                        ),
                                    },
                                ]}
                                // Filter out services without any selected details
                                dataSource={
                                    (solicitudDetails?.servicios || []).filter(
                                        (servicio) => (selectedDetalles[servicio.id_servicio] || []).length > 0
                                    )
                                }
                                pagination={false}
                                rowKey="id_servicio"
                            />
                        </div>

                        <div className="d-flex align-items-center mt-2">
                            <Button
                                disabled={isFinalized}
                                type="primary"
                                onClick={() => setNewDetalles([...newDetalles, { key: newDetalles.length, detalle: '' }])}
                                style={{ marginRight: '8px' }}

                            >
                                Añadir
                            </Button>
                        </div>

                        <div className="mt-4">
                            {newDetalles.map((detalle, index) => (
                                <div key={index} className="d-flex mb-2">
                                    <Input
                                        disabled={isFinalized}
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
                                        disabled={isFinalized}
                                        danger
                                        icon={<DeleteOutlined />}
                                        onClick={() => setNewDetalles(newDetalles.filter((_, i) => i !== index))}
                                    />
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Detalle Proforma */}
                    <Card
                        className="mb-4"
                        title={
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span>Detalle Proforma</span>
                                <div>
                                    <Checkbox
                                        disabled={isFinalized}
                                        checked={sinIVA}
                                        onChange={(e) => setSinIVA(e.target.checked)}
                                        className="sinIVA-checkbox"
                                    >
                                        Sin IVA
                                    </Checkbox>
                                    <Checkbox
                                        checked={sinDetalle}
                                        onChange={(e) => setSinDetalle(e.target.checked)}
                                        className="sinDetalle-checkbox"
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Sin Detalle
                                    </Checkbox>

                                </div>
                            </div>
                        }
                        style={{
                            boxShadow: "0 2px 2px 0 rgba(0,0,0,0.2)",
                        }}>
                        <Space style={{ marginBottom: 16 }}>
                            <Button type="primary" onClick={() => setShowCatalog(true)} disabled={isFinalized}>
                                Abrir Catálogo
                            </Button>
                        </Space>

                        {!sinDetalle && (
                            <Table
                                dataSource={selectedProducts}
                                columns={
                                    sinIVA
                                        ? columns_proforma.filter((col) => !['I.V 13%', 'TOTAL'].includes(col.title))
                                        : columns_proforma
                                }
                                pagination={false}
                                rowKey={(record) => `${record.codigo_producto}-${record.inventarioId}`}
                            />
                        )}




                        {/* New Editable Table */}
                        <Table
                            dataSource={
                                dataWithMateriales.map((row) =>
                                    sinDetalle || row.key !== 'materiales' ? row : { ...row, hidden: true }
                                ).filter((row) => !row.hidden)
                            }
                            columns={
                                sinIVA
                                    ? extraColumns.filter((col) => col.dataIndex !== 'impuesto' && col.dataIndex !== 'total')
                                    : extraColumns
                            }
                            pagination={false}
                            rowKey="key"
                            style={{ marginTop: 30 }}
                        />

                        <Space style={{ marginTop: 16 }}>
                            <Button type="primary" onClick={handleAddExtraRow} disabled={isFinalized}  >
                                Añadir
                            </Button>
                        </Space>

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
                                    disabled={isFinalized}
                                    value={notas}
                                    onChange={(e) => setNotas(e.target.value)}
                                    placeholder="Escribe tus notas aquí..."
                                    style={{
                                        width: '100%',
                                        height: '100px',
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
                                    height: '250px', // Slightly increased height for table
                                    overflow: 'hidden', // Prevent overflow
                                }}
                                headStyle={{ backgroundColor: '#fafafa' }}
                            >
                                <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr>
                                            <th style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>Descripción</th>
                                            <th style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}><strong>SUBTOTAL:</strong></td>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>₡ {formatWithCommas(sumExcedente)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}><strong>I.V 13%:</strong></td>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>₡ {formatWithCommas(iva)}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}><strong>TOTAL:</strong></td>
                                            <td style={{ padding: '8px', borderBottom: '1px solid #ddd', textAlign: 'right' }}>₡ {formatWithCommas(totalWithIVA)}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </Card>

                        </div>
                    </Card>






                    <Card className="mb-4" title="Cuentas Bancarias"
                        style={{
                            boxShadow: "0 2px 2px 0 rgba(0,0,0,0.2)",
                        }}>
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
                    <div
                        className="text-center mt-4 button-group"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap', // Ensures responsiveness on smaller screens
                            gap: '15px',
                        }}
                    >
                        {/* Left-aligned Regresar Button */}
                        <Button
                            type="default"
                            size="large"
                            onClick={() => navigate("/mantenimiento/proformas")}
                        >
                            Regresar
                        </Button>

                        {/* Right-aligned Buttons */}
                        <div
                            style={{
                                display: 'flex',
                                gap: '15px',
                                flexWrap: 'wrap', // Ensures responsiveness for multiple buttons
                            }}
                        >
                            <Button
                                type="primary"
                                variant="outlined"
                                onClick={() => window.print()}
                                size="large"
                                style={{
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: '#fff',
                                }}
                            >
                                Imprimir
                            </Button>

                            {!isFinalized && (
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={handleSaveProforma}
                                    loading={isEditing ? isUpdating : isCreating}
                                >
                                    {isEditing ? "Actualizar" : "Generar"}
                                </Button>
                            )}

                            {proformaEstado === "En Progreso" && (
                                <Button
                                    type="primary"
                                    size="large"
                                    onClick={() => setIsModalVisible(true)}
                                    loading={isLoading}
                                    style={{ backgroundColor: '#22c55e' }}
                                >
                                    Finalizar
                                </Button>
                            )}

                            {isEditing && !isFinalized && (
                                <Button
                                    type="primary"
                                    danger
                                    size="large"
                                    onClick={() => setIsDeleteModalVisible(true)}
                                >
                                    Eliminar
                                </Button>
                            )}
                        </div>
                    </div>


                    {/* Confirmation Modal for Delete */}
                    <Modal
                        title="Eliminar Proforma"
                        visible={isDeleteModalVisible}
                        onOk={handleDeleteProforma}
                        confirmLoading={isDeleting}
                        onCancel={() => setIsDeleteModalVisible(false)}
                    >
                        <hr style={{ borderTop: '1px solid rgba(0,0,0,.1)' }} />
                        <p>¿Está seguro de que desea eliminar esta proforma? Esta acción no se puede deshacer.</p>
                    </Modal>

                    {/* Confirmation Modal for Finalizing */}
                    <Modal
                        title="Finalizar Proforma"
                        visible={isModalVisible}
                        onOk={handleFinalizeProforma}
                        confirmLoading={isLoading}
                        onCancel={() => setIsModalVisible(false)}
                    >
                        <hr style={{ borderTop: '1px solid rgba(0,0,0,.1)' }} />
                        <p>
                            Al finalizar la proforma, los productos seleccionados se descontarán de los
                            inventarios correspondientes. ¿Estás seguro?
                        </p>
                    </Modal>





                </div>

            </Card>



        </div>
    );
}

