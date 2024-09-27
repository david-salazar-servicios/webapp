import React, { useState, useRef } from 'react';
import { useGetSolicitudesQuery } from '../../features/RequestService/RequestServiceApiSlice';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { Popconfirm } from 'antd';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { Toast } from 'primereact/toast';
import CitaForm from '../cita/CitaForm';
import { format } from 'date-fns';
import { Row, Col, Card } from 'antd';

export default function SolicitudesTable() {
    const { data, isLoading, isError, error, refetch } = useGetSolicitudesQuery();
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentSolicitud, setCurrentSolicitud] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false); // New state to track if it's an update
    const dt = useRef(null);
    const toast = useRef(null);

    const solicitudes = data ? [...data].sort((a, b) => a.estado === 'Pendiente' ? -1 : 1) : [];

    const showCitaForm = (solicitud, isUpdate) => {
        setCurrentSolicitud(solicitud);
        setIsUpdate(isUpdate); // Set if it's an update or a new creation
        setIsModalVisible(true);
    };

    const handleConfirm = (solicitud) => {
        // Logic for updating the solicitud (or any other logic)
        const isUpdate = solicitud.estado === 'En Agenda'; // True if updating, false if creating new
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

    const statusBodyTemplate = (rowData) => {
        const status = rowData.estado === 'Pendiente' ? 'warning' :
            rowData.estado === 'En Agenda' ? 'info' : 'success';

        if (rowData.estado === 'Pendiente' || rowData.estado === 'En Agenda') {
            const confirmText = rowData.estado === 'Pendiente' ?
                "¿Quieres confirmar y agendar esta solicitud?" :
                "¿Quieres actualizar esta solicitud?";

            return (
                <Popconfirm
                    title={confirmText}
                    onConfirm={() => handleConfirm(rowData)} // Confirmation required before opening the form
                    onCancel={handleCancel}
                    okText="Sí"
                    cancelText="No"
                    placement="top"
                >
                    <Tag
                        value={rowData.estado}
                        severity={status}
                        style={{ cursor: 'pointer' }} // Make it clear that this tag is interactive
                    />
                </Popconfirm>
            );
        }

        // Default case for other states
        return <Tag value={rowData.estado} severity={status} />;
    };

    const header = (
        <Row align="middle" justify="space-between" className="table-header">
            <Col>
                <InputText
                    type="search"
                    onInput={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar..."
                    style={{ marginRight: '1rem' }}
                />
                <Button
                    label="Exportar"
                    icon="pi pi-upload"
                    className="p-button-help"
                    style={{ borderRadius: "10px", background: "#05579E", border: "1px solid #05579E" }}
                    onClick={() => dt.current.exportCSV()}
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
                <Card title="Solicitudes" bordered={false} style={{
                    boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                    borderRadius: "5px",
                }}>
                    <Col span={24} style={{ flexGrow: 1 }}>
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
                            
                            <Column field="fecha_preferencia" header="Fecha & Hora Cita" sortable body={rowData => format(new Date(rowData.fecha_preferencia), 'yyyy-dd-MM HH:mm')} style={{ width: '14rem' }}></Column>
                            <Column field="nombre" header="Nombre" sortable style={{ width: '10rem' }}></Column>
                            <Column field="apellido" header="Apellido" sortable style={{ width: '10rem' }}></Column>
                            <Column field="correo_electronico" header="Correo Electrónico" sortable style={{ width: '14rem' }}></Column>
                            <Column field="telefono" header="Teléfono" sortable style={{ width: '10rem' }}></Column>
                            <Column field="observacion" header="Observación" sortable style={{ width: '12rem' }}></Column>
                            <Column field="fecha_creacion" header="Fecha de Creación" sortable body={rowData => format(new Date(rowData.fecha_creacion), 'yyyy-dd-MM')} style={{ width: '12rem' }}></Column>
                            <Column field="estado" header="Estado" body={statusBodyTemplate} sortable style={{ width: '10rem' }}></Column>
                        </DataTable>
                    </Col>
                </Card>
                <CitaForm key={currentSolicitud?.id_solicitud} visible={isModalVisible} onClose={() => handleFormClose(true)} solicitudData={currentSolicitud} isUpdate={isUpdate} />
            </Row>
        </>
    );
}
