import React, { useState, useRef, useEffect } from 'react';
import { useGetSolicitudesQuery, useUpdateSolicitudEstadoMutation } from '../../features/RequestService/RequestServiceApiSlice';
import { useDeleteCitaMutation, useGetAllCitasQuery } from '../../features/cita/CitaApiSlice';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { Popconfirm, Modal } from 'antd';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import CitaForm from '../cita/CitaForm';
import { format } from 'date-fns';
import { Row, Col, Card } from 'antd';
import { useSendGenericEmailMutation } from '../../features/contacto/sendGenericEmailApiSlice';

export default function SolicitudesTable() {
    const { data, isLoading, isError, error, refetch } = useGetSolicitudesQuery();
    const { data: citaData } = useGetAllCitasQuery();
    const [updateSolicitudEstado] = useUpdateSolicitudEstadoMutation();
    const [sendGenericEmail] = useSendGenericEmailMutation();
    const [deleteCita] = useDeleteCitaMutation();
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentSolicitud, setCurrentSolicitud] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const dt = useRef(null);
    const toast = useRef(null);
    const navigate = useNavigate();
    const DATE_TIME_FORMAT = 'yyyy-MM-dd HH:mm';

    // Refrescar datos cada vez que el componente se monte
    useEffect(() => {
        refetch();
    }, [refetch]);


    const solicitudes = data ? [...data].sort((a, b) => a.estado === 'Pendiente' ? -1 : 1) : [];
    console.log(solicitudes)
    const showCitaForm = (solicitud, isUpdate) => {
        setCurrentSolicitud(solicitud);
        setIsUpdate(isUpdate);
        setIsModalVisible(true);
    };


    const handleConfirm = (solicitud) => {
        const isUpdate = solicitud.estado === 'En Agenda';
        showCitaForm(solicitud, isUpdate);
    };

    const handleCancel = () => {
        // Close pop-up when canceled
    };

    const handleFormClose = (shouldRefetch = false) => {
        setIsModalVisible(false);
        if (shouldRefetch) {
            refetch();
        }
    };

    const handleRevertToEnAgenda = async (solicitud) => {
        try {
            // Update the solicitud to "En Agenda"
            await updateSolicitudEstado({ id: solicitud.id_solicitud, estado: 'En Agenda' }).unwrap();

            // Send generic email alerting that the solicitud has been reverted to "En Agenda"
            await sendGenericEmail({
                nombre: solicitud.nombre,
                correo: solicitud.correo_electronico, // Ensure solicitud object contains 'correo'
                mensaje: `La solicitud con ID ${solicitud.id_solicitud} ha sido revertida al estado "En Agenda".`,
                telefono: `${solicitud.telefono}${solicitud.telefono_fijo ? ' / ' + solicitud.telefono_fijo : ''}`, // Only add telefono_fijo if it exists
                type: "Revertir_A_Aagenda"
            }).unwrap();

            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Solicitud revertida a En Agenda', life: 3000 });
            refetch(); // Refetch the solicitudes to update the table
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al revertir la solicitud', life: 5000 });
        }
    };


    const handleRestoreSolicitud = async (solicitud) => {
        try {
            // Restore the solicitud to "Pendiente"
            await updateSolicitudEstado({ id: solicitud.id_solicitud, estado: 'Pendiente' }).unwrap();

            // Check if there is a related cita and delete it
            const relatedCita = citaData?.find(cita => cita.id_solicitud === solicitud.id_solicitud);
            if (relatedCita) {
                await deleteCita(relatedCita.id_cita).unwrap();
            }

            // Send generic email alerting that the solicitud has been restored
            await sendGenericEmail({
                nombre: solicitud.nombre,
                correo: solicitud.correo_electronico, // Ensure solicitud object contains 'correo'
                mensaje: `La solicitud con ID ${solicitud.id_solicitud} ha sido restaurada al estado "Pendiente".`,
                telefono: `${solicitud.telefono}${solicitud.telefono_fijo ? ' / ' + solicitud.telefono_fijo : ''}`, // Only add telefono_fijo if it exists
                type: "RestaurarSolicitud"
            }).unwrap();

            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Solicitud restaurada correctamente', life: 3000 });
            refetch(); // Refetch the solicitudes to update the table
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al restaurar la solicitud', life: 5000 });
        }
    };

    const statusBodyTemplate = (rowData) => {
        let statusColor;
        switch (rowData.estado) {
            case 'Pendiente':
                statusColor = 'warning';
                break;
            case 'En Agenda':
                statusColor = 'info';
                break;
            case 'Confirmada':
                statusColor = 'success';
                break;
            case 'Rechazada':
                statusColor = 'danger';
                break;
            default:
                statusColor = 'neutral';
        }

        if (rowData.estado === 'Pendiente' || rowData.estado === 'En Agenda') {
            const confirmText = rowData.estado === 'Pendiente' ?
                "¿Quieres confirmar y agendar esta solicitud?" :
                "¿Quieres actualizar esta solicitud?";

            return (
                <Popconfirm
                    title={confirmText}
                    onConfirm={() => handleConfirm(rowData)}
                    onCancel={handleCancel}
                    okText="Sí"
                    cancelText="No"
                    placement="top"
                >
                    <Tag
                        value={rowData.estado}
                        severity={statusColor}
                        style={{ cursor: 'pointer' }}
                    />
                </Popconfirm>
            );
        }

        if (rowData.estado === 'Rechazada') {
            return (
                <Popconfirm
                    title="¿Deseas restaurar esta solicitud?"
                    onConfirm={() => handleRestoreSolicitud(rowData)} // Call handleRestoreSolicitud on confirmation
                    onCancel={handleCancel}
                    okText="Sí"
                    cancelText="No"
                    placement="top"
                >
                    <Tag
                        value={rowData.estado}
                        severity={statusColor}
                        style={{ cursor: 'pointer' }}
                    />
                </Popconfirm>
            );
        }

        if (rowData.estado === 'Confirmada') {
            return (
                <Popconfirm
                    title="¿Deseas revertir el estado a 'En Agenda'?"
                    onConfirm={() => handleRevertToEnAgenda(rowData)}  // Call handleRevertToEnAgenda on confirmation
                    onCancel={handleCancel}
                    okText="Sí"
                    cancelText="No"
                    placement="top"
                >
                    <Tag
                        value={rowData.estado}
                        severity={statusColor}
                        style={{ cursor: 'pointer' }}
                    />
                </Popconfirm>
            );
        }

        return <Tag value={rowData.estado} severity={statusColor} />;
    };

    const header = (
        <Row align="middle" justify="space-between" className="table-header">
            <Col>
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar..."
                    className="p-inputtext"
                />
                <Button
                    label="Exportar"
                    icon="pi pi-upload"
                    className="p-button p-button-help"
                    style={{
                        borderRadius: "10px",
                        background: "#05579E",
                        border: "1px solid #05579E",
                        marginLeft: "10px",
                        padding: window.innerWidth <= 768 ? '6px 10px' : '10px 16px',
                        fontSize: window.innerWidth <= 768 ? '12px' : '14px',
                    }}
                    onClick={() => dt.current.exportCSV()}
                />
                <Button
                    label="Nueva Solicitud"
                    icon="pi pi-plus"
                    className="p-button p-button-help"
                    style={{
                        borderRadius: "10px",
                        background: "#05579E",
                        border: "1px solid #05579E",
                        marginLeft: "10px",
                        padding: window.innerWidth <= 768 ? '6px 10px' : '10px 16px',
                        fontSize: window.innerWidth <= 768 ? '12px' : '14px',
                    }}
                    onClick={() => navigate('/mantenimiento/CrearSolicitud')}
                />
            </Col>
        </Row>
    );
    
    

    if (isLoading) {
        return <ProgressBar mode="indeterminate" />;
    }

    if (isError) {
        return <div>Hubo un error al obtener las solicitudes: {error?.data?.error || 'Unknown error'}</div>;
    }

    return (
        <>
            <Toast ref={toast} />
            <Row style={{ display: 'flex', flexDirection: 'column' }}>

                    <Col span={24} style={{ flexGrow: 1 }}>
                    <div
                        className="card-container"
                        style={{
                            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)',
                            borderRadius: '8px',
                            padding: '16px',
                            backgroundColor: '#fff',
                        }}
                    >
                        <DataTable
                            ref={dt}
                            value={solicitudes}
                            dataKey="id_solicitud"
                            paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} solicitudes"
                            globalFilter={globalFilter}
                            header={header}
                            scrollable
                            scrollHeight="100%"
                            className="custom-hover-effect elegant-table"
                        >
                            <Column field="id_solicitud" header="Id Solicitud" sortable style={{ width: '8rem' }}></Column>
                            <Column
                                field="fecha_preferencia"
                                header="Fecha & Hora Cita"
                                sortable
                                body={rowData => new Date(rowData.fecha_preferencia).toISOString().replace('T', ' ').slice(0, 16)}
                            />
                            <Column field="nombre" header="Nombre" sortable style={{ width: '10rem' }}></Column>
                            <Column field="apellido" header="Apellido" sortable style={{ width: '10rem' }}></Column>
                            <Column field="correo_electronico" header="Correo Electrónico" sortable style={{ width: '14rem' }}></Column>
                            <Column field="telefono" header="Teléfono Móvil" sortable style={{ width: '10rem' }}></Column>
                            <Column field="telefono_fijo" header="Teléfono Fijo" sortable style={{ width: '10rem' }}></Column>
                            <Column field="direccion" header="Dirección" sortable style={{ width: '15rem' }}></Column>
                            <Column field="observacion" header="Observación" sortable style={{ width: '12rem' }}></Column>
                            <Column field="fecha_creacion" header="Fecha de Creación" sortable body={rowData => format(new Date(rowData.fecha_creacion), 'dd-MM-yyyy')} style={{ width: '12rem' }}></Column>
                            <Column field="estado" header="Estado" body={statusBodyTemplate} sortable style={{ width: '10rem' }}></Column>
                        </DataTable>
                        </div>
                    </Col>

                <CitaForm key={currentSolicitud?.id_solicitud} visible={isModalVisible} onClose={() => handleFormClose(true)} solicitudData={currentSolicitud} isUpdate={isUpdate} />
            </Row>
        </>
    );
}
