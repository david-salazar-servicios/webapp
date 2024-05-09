import React, { useState, useRef } from 'react';
import { useGetSolicitudesQuery } from '../../features/RequestService/RequestServiceApiSlice';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
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
    const dt = useRef(null);
    const toast = useRef(null);

    const solicitudes = data ? [...data].sort((a, b) => a.estado === 'Pendiente' ? -1 : 1) : [];

    const showCitaForm = (solicitud) => {
        if (solicitud.estado === 'En Agenda') {
            toast.current.show({
                severity: 'info',
                summary: 'Información',
                detail: 'La solicitud ya está en agenda',
                life: 3000
            });
        } else {
            setCurrentSolicitud(solicitud);
            setIsModalVisible(true);
        }
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
                    style={{borderRadius:"10px",background:"#05579E", border:"1px solid #05579E"}}
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
                            onRowClick={(e) => showCitaForm(e.data)}
                            className="custom-hover-effect elegant-table"
                        >
                            <Column field="id_solicitud" header="Id Solicitud" sortable style={{ width: '8rem' }}></Column>
                            <Column field="fecha_creacion" header="Fecha de Creación" sortable body={rowData => format(new Date(rowData.fecha_creacion), 'yyyy-dd-MM HH:mm')} style={{ width: '12rem' }}></Column>
                            <Column field="fecha_preferencia" header="Fecha de Preferencia" sortable body={rowData => format(new Date(rowData.fecha_preferencia), 'yyyy-dd-MM HH:mm')} style={{ width: '14rem' }}></Column>
                            <Column field="nombre" header="Nombre" sortable style={{ width: '10rem' }}></Column>
                            <Column field="apellido" header="Apellido" sortable style={{ width: '10rem' }}></Column>
                            <Column field="correo_electronico" header="Correo Electrónico" sortable style={{ width: '14rem' }}></Column>
                            <Column field="telefono" header="Teléfono" sortable style={{ width: '10rem' }}></Column>
                            <Column field="observacion" header="Observación" sortable style={{ width: '12rem' }}></Column>
                            <Column field="estado" header="Estado" body={statusBodyTemplate} sortable style={{ width: '10rem' }}></Column>
                        </DataTable>
                    </Col>
                </Card>
                <CitaForm key={currentSolicitud?.id_solicitud} visible={isModalVisible} onClose={() => handleFormClose(true)} citaData={currentSolicitud} />
            </Row>
        </>
    );
}