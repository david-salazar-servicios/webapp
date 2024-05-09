import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Spin, Alert, Input } from 'antd';
import { useGetAllCitasQuery } from "../../features/cita/CitaApiSlice";
import { useGetSolicitudByIdQuery } from "../../features/RequestService/RequestServiceApiSlice";

const localizer = momentLocalizer(moment);

const ProcessCalendar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: citas, isLoading: isCitasLoading, isError: isCitasError } = useGetAllCitasQuery();
  const { data: solicitudDetails, isLoading: isSolicitudDetailsLoading, isError: isSolicitudDetailsError } = useGetSolicitudByIdQuery(selectedEvent?.solicitudId, {
    skip: !selectedEvent
  });

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const events = citas
    ?.filter(cita => cita.estado === 'En Agenda')
    .filter(cita =>
      cita.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cita.id_solicitud.toString().includes(searchTerm)
    )
    .map(cita => ({
      title: `Solicitud ${cita.id_solicitud} - ${cita.nombre || 'Sin nombre'} ${cita.apellido || 'Sin apellido'}`,
      start: new Date(cita.datetime),
      end: new Date(new Date(cita.datetime).getTime() + 60 * 60 * 1000),
      desc: `Estado: ${cita.estado}`,
      solicitudId: cita.id_solicitud,
      tecnicoId: cita.id_tecnico,
      tecnicoNombre: cita.tecnico_nombre,
      tecnicoApellido: cita.tecnico_apellido
    })) || [];

  if (isCitasLoading) {
    return <Spin size="large" />;
  }

  if (isCitasError) {
    return <Alert message="Error loading data" type="error" />;
  }

  return (
    <div style={{ height: "100%" }}>
      <Input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem',
          width: '210px', // Ajusta esta medida según sea necesario
          borderRadius: '5px',
          border: '1px solid #05579E'
        }}
      />

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView='month'
        views={['month', 'week', 'day', 'agenda']}
        onSelectEvent={handleEventClick}
      />
      {selectedEvent && (
        <Modal
          title={selectedEvent.title}
          open={modalVisible}
          onOk={closeModal}
          onCancel={closeModal}
          footer={null}
        >
          {isSolicitudDetailsLoading ? (
            <Spin size="large" />
          ) : isSolicitudDetailsError ? (
            <Alert message="Error loading solicitud details" type="error" />
          ) : (
            <div>
              <p><strong>Usuario:</strong> {solicitudDetails?.nombre} {solicitudDetails?.apellido}</p>
              <p><strong>Correo electrónico:</strong> {solicitudDetails?.correo_electronico}</p>
              <p><strong>Teléfono:</strong> {solicitudDetails?.telefono}</p>
              <p><strong>Observación:</strong> {solicitudDetails?.observacion}</p>
              <p><strong>Fecha preferencia:</strong> {moment(solicitudDetails?.fecha_preferencia).format('YYYY-MM-DD HH:mm')}</p>
              <p><strong>Técnico:</strong> {selectedEvent.tecnicoNombre} {selectedEvent.tecnicoApellido || 'Desconocido'}</p>
              {solicitudDetails?.detalles && solicitudDetails.detalles.length > 0 && (
                <>
                  <h4>Detalles del Servicio</h4>
                  {solicitudDetails.detalles.map(detalle => (
                    <div key={detalle.id_detalle_solicitud}>
                      <p><strong>Servicio:</strong> {detalle.servicio_nombre}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
};

export default ProcessCalendar;