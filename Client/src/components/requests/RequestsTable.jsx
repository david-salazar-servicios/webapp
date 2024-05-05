import React, { useState, useRef } from 'react';
import { useGetSolicitudesQuery } from '../../features/RequestService/RequestServiceApiSlice';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toolbar } from 'primereact/toolbar';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import CitaForm from '../cita/CitaForm';
import { format } from 'date-fns';

export default function SolicitudesTable() {
    const { data: solicitudes, isLoading, isError, error, refetch } = useGetSolicitudesQuery(); // Destructure refetch
    const [globalFilter, setGlobalFilter] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [currentSolicitud, setCurrentSolicitud] = useState(null);
    const dt = useRef(null);

    const showCitaForm = (solicitud) => {
        setCurrentSolicitud(solicitud);
        setIsModalVisible(true);
    };

    const handleFormClose = (shouldRefetch = false) => {
        setIsModalVisible(false);
        if (shouldRefetch) {
            refetch(); // Refetch data when form is closed and updates are made
        }
    };

    const rightToolbarTemplate = () => {
        return (
            <Button
                label="Export"
                icon="pi pi-upload"
                className="p-button-help"
                onClick={() => dt.current.exportCSV()}
                style={{ backgroundColor: '#FF8E00', borderColor: '#FF8E00' }} // Applying orange color
            />
        );      
    };

    const statusBodyTemplate = (rowData) => {
        const status = rowData.estado === 'Pendiente' ? 'warning' :
                       rowData.estado === 'En Agenda' ? 'info' : 'success';
        return <Tag value={rowData.estado} severity={status} />;
    };

    const header = (
        <div className="table-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Toolbar right={rightToolbarTemplate} style={{ padding: 0, border:"0px solid" }} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        type="search"
                        onInput={(e) => setGlobalFilter(e.target.value)}
                        placeholder="Search..."
                    />
                </span>
            </div>
        </div>
    );

    if (isLoading) {
        return <ProgressBar mode="indeterminate" />;
    }

    if (isError) {
        return <div>Hubo un error al obtener las solicitudes: {error?.data?.error || 'Unknown error'}</div>;
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flexGrow: 1 }}>
                <DataTable
                    ref={dt}
                    value={solicitudes}
                    dataKey="id_solicitud"
                    paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} solicitudes"
                    globalFilter={globalFilter}
                    header={header}
                    scrollable
                    scrollHeight="100%"
                    onRowClick={(e) => showCitaForm(e.data)}
                    className="custom-hover-effect" // Adding custom class for hover effect
                    style={{border:"grey 1px solid"}}
                >
                    <Column field="id_solicitud" header="Id Solicitud" sortable style={{ width: '6rem' }}></Column>
                    <Column field="fecha_creacion" header="Fecha de Creación" sortable  body={rowData => format(new Date(rowData.fecha_creacion), 'yyyy-dd-MM HH:mm')}style={{ width: '9rem' }}></Column>
                    <Column field="fecha_preferencia" header="Fecha de Preferencia" sortable body={rowData => format(new Date(rowData.fecha_preferencia), 'yyyy-dd-MM HH:mm')} style={{ width: '12rem' }}></Column>
                    <Column field="nombre" header="Nombre" sortable style={{ width: '8rem' }}></Column>
                    <Column field="apellido" header="Apellido" sortable style={{ width: '8rem' }}></Column>
                    <Column field="correo_electronico" header="Correo Electrónico" sortable style={{ width: '12rem' }}></Column>
                    <Column field="telefono" header="Teléfono" sortable style={{ width: '8rem' }}></Column>
                    <Column field="observacion" header="Observación" sortable style={{ width: '10rem' }}></Column>
                    <Column field="estado" header="Estado" body={statusBodyTemplate} sortable style={{ width: '8rem' }}></Column>
                </DataTable>
            </div>
            <CitaForm key={currentSolicitud?.id_solicitud} visible={isModalVisible} onClose={() => handleFormClose(true)} citaData={currentSolicitud} />
        </div>
    );
}
