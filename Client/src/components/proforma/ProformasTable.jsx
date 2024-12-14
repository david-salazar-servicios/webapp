import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ProgressBar } from 'primereact/progressbar';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Card, Row, Col } from 'antd';
import { useGetProformasQuery } from '../../features/Proforma/ProformaApiSlice';
import { useGetSolicitudesByTecnicoQuery } from '../../features/RequestService/RequestServiceApiSlice';
import { format } from 'date-fns';
import moment from 'moment';
import useAuth from "../../hooks/useAuth";

export default function ProformasTable() {
    const { data: proformas = [], isLoading, isError, error } = useGetProformasQuery();
    const [searchQuery, setSearchQuery] = useState('');
    const dt = useRef(null);
    const navigate = useNavigate();
    const { roles, userId } = useAuth();
    const isNotAdmin = !roles.includes("Admin");


    const { data: solicitudesByTecnico = [], isLoading: isLoadingSolicitudes } = useGetSolicitudesByTecnicoQuery(userId, {
        skip: !isNotAdmin,
    });

    const today = moment().format('YYYY-MM-DD');

    const filteredProformas = Array.isArray(proformas)
        ? proformas.filter((proforma) => {
            if (isNotAdmin) {
                // Filter by solicitudes assigned to the technician and only for today's solicitudes
                return solicitudesByTecnico.some(
                    (solicitud) =>
                        proforma.estado === 'En Progreso' &&
                        solicitud.id_solicitud === proforma.id_solicitud &&
                        moment(solicitud.fecha_preferencia).isSame(today, 'day') // Match today's date
                );
            }
            return true; // Admins see all proformas
        }).filter((proforma) => {
            // Apply search query filtering
            const query = searchQuery.toLowerCase();
            return (
                proforma.numeroarchivo?.toLowerCase().includes(query) ||
                proforma.id_solicitud?.toString().includes(query) ||
                proforma.id_proforma?.toString().includes(query) ||
                proforma.cliente?.toLowerCase().includes(query) ||
                proforma.tecnico?.toLowerCase().includes(query)
            );
        })
        : [];


    const formatWithCommas = (number) => {
        return new Intl.NumberFormat('en-US').format(number);
    };

    const header = (
        <Row align="middle" justify="space-between" className="table-header">
            <Col>
                <InputText
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)} // Update search query
                    placeholder="Buscar por N° Archivo, Cliente, Técnico, Proforma o Solicitud"
                    className="p-inputtext"
                />
                <Button
                    label="Exportar"
                    icon="pi pi-upload"
                    className="p-button-help"
                    style={{ borderRadius: "10px", background: "#05579E", border: "1px solid #05579E" }}
                    onClick={() => dt.current.exportCSV()}
                />
            </Col>
            <Col>
                <Button
                    label="Crear Proforma"
                    icon="pi pi-plus"
                    className="p-button-help"
                    style={{ borderRadius: "10px", background: "#05579E", border: "1px solid #05579E" }}
                    onClick={() => navigate(`/mantenimiento/proformas/create`, { state: { proformaList: proformas } })}
                />
            </Col>
        </Row>
    );

    const handleRowClick = (rowData) => {
        navigate(`/mantenimiento/proformas/${rowData.id_proforma}`, { state: { proformaList: proformas } });
    };

    // Custom rendering for `estado` column
    const estadoBodyTemplate = (rowData) => {
        let color;

        switch (rowData.estado) {
            case 'En Progreso':
                color = 'warning'; // Amber color for "En Progreso"
                break;
            case 'Finalizada':
                color = 'success'; // Green color for "Finalizada"
                break;
            default:
                color = 'neutral'; // Default gray color
        }

        return (
            <Tag value={rowData.estado} severity={color} style={{ padding: '0.5rem' }} />
        );
    };

    if (isLoading) {
        return <ProgressBar mode="indeterminate" />;
    }

    if (isError) {
        return <div>Error al obtener las proformas: {error?.data?.error || 'Unknown error'}</div>;
    }

    return (
        <div className="card-container"
        style={{
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', // Sombra suave
            borderRadius: '8px', // Bordes redondeados
            padding: '16px', // Espaciado interno
            backgroundColor: '#fff', // Fondo blanco
        }}>

                    <DataTable
                        ref={dt}
                        value={filteredProformas || []} // Data from API
                        dataKey="id_proforma"
                        paginator
                        rows={10}
                        rowsPerPageOptions={[5, 10, 25]}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} proformas"
                        header={header}
                        scrollable
                        scrollHeight="100%"
                        className="custom-hover-effect elegant-table"
                        onRowClick={(e) => handleRowClick(e.data)} // Redirect on row click
                    >
                        {!isNotAdmin && (
                            <Column field="numeroarchivo" header="N° Archivo" sortable style={{ width: '10rem' }}></Column>
                        )}

                        <Column field="cliente" header="Cliente" sortable style={{ width: '10rem' }}></Column>
                        <Column field="tecnico" header="Técnico" sortable style={{ width: '10rem' }}></Column>
                        {!isNotAdmin && (

                            <Column
                                field="total"
                                header="Total"
                                body={(rowData) => `₡ ${formatWithCommas(parseFloat(rowData.total).toFixed(2))}`}
                                sortable
                                style={{ width: '10rem' }}
                            />
                        )}
                        <Column
                            field="fechacreacion"
                            header="Fecha de Creación"
                            body={(rowData) => format(new Date(rowData.fechacreacion), 'dd-MM-yyyy')}
                            sortable
                            style={{ width: '10rem' }}
                        />
                        <Column field="id_proforma" header="Proforma" sortable style={{ width: '10rem' }}></Column>
                        <Column field="id_solicitud" header="Solicitud" sortable style={{ width: '10rem' }}></Column>
                        <Column
                            field="ultima_modificacion"
                            header="Última Modificación"
                            body={(rowData) => format(new Date(rowData.ultima_modificacion), 'dd-MM-yyyy')}
                            sortable
                            style={{ width: '10rem' }}
                        />
                        <Column
                            field="estado"
                            header="Estado"
                            body={estadoBodyTemplate} // Apply custom body template
                            sortable
                            style={{ width: '10rem' }}
                        />
                    </DataTable>
           

        </div>
    );
}
