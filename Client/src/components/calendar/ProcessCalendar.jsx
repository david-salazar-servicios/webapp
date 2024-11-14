import React, { useState, useEffect } from "react";
import { Calendar, dayjsLocalizer, momentLocalizer } from "react-big-calendar";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from "dayjs"
import moment from "moment";
import 'moment/locale/es'; // Import Spanish locale for moment
import { Modal, Spin, Alert, Input, Card, Typography, List, Row, Col, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useGetSolicitudesQuery, useGetSolicitudByIdQuery } from "../../features/RequestService/RequestServiceApiSlice";
import "dayjs/locale/es"

const { Text, Title } = Typography;
const localizer = dayjsLocalizer(dayjs);
dayjs.locale("es")

const ProcessCalendar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState("All");

  const { data: solicitudes, isLoading, isError, refetch } = useGetSolicitudesQuery();
  const { data: solicitudDetails, isLoading: isSolicitudDetailsLoading, isError: isSolicitudDetailsError } = useGetSolicitudByIdQuery(selectedEvent?.solicitudId, {
    skip: !selectedEvent
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleStatusFilterClick = (status) => {
    setActiveStatusFilter(status);
  };

  const getStatusTagColor = (status) => {
    switch (status) {
      case 'En Agenda':
        return 'blue';
      case 'Confirmada':
        return 'green';
      case 'Rechazada':
        return 'red';
      default:
        return 'default';
    }
  };

  const filteredEvents = solicitudes
    ?.filter(solicitud =>
      solicitud.estado !== 'Pendiente' &&
      (activeStatusFilter === "All" || solicitud.estado === activeStatusFilter) &&
      (solicitud.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solicitud.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
        solicitud.id_solicitud.toString().includes(searchTerm))
    )
    .map(solicitud => ({
      title: `Solicitud ${solicitud.id_solicitud} - ${solicitud.nombre || 'Sin nombre'} ${solicitud.apellido || 'Sin apellido'}`,
      start: new Date(solicitud.fecha_creacion),
      end: new Date(solicitud.fecha_creacion),
      desc: `Estado: ${solicitud.estado}`,
      solicitudId: solicitud.id_solicitud,
      estado: solicitud.estado,
      nombre: solicitud.nombre,
      apellido: solicitud.apellido,
      correo: solicitud.correo_electronico,
      telefono: solicitud.telefono,
      observacion: solicitud.observacion,
    }));

  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.estado) {
      case 'En Agenda':
        backgroundColor = '#0EA5E9';
        break;
      case 'Confirmada':
        backgroundColor = '#22C55E';
        break;
      case 'Rechazada':
        backgroundColor = '#FF4D4F';
        break;
      default:
        backgroundColor = '#3182ce';
    }
    return {
      style: { backgroundColor }
    };
  };

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError) {
    return <Alert message="Error loading data" type="error" />;
  }

  return (
    <div style={{ height: "100%", padding: '20px' }}>
      {/* Status Filter Tags */}
      <div style={{ marginBottom: '1rem' }}>
        <Tag
          color="default"
          onClick={() => handleStatusFilterClick("All")}
          style={{
            cursor: 'pointer',
            fontSize: '16px',
            padding: '8px 16px',
            borderRadius: '8px'
          }}
        >
          Todos
        </Tag>
        <Tag
          color={getStatusTagColor("En Agenda")}
          onClick={() => handleStatusFilterClick("En Agenda")}
          style={{
            cursor: 'pointer',
            fontSize: '16px',
            padding: '8px 16px',
            borderRadius: '8px'
          }}
        >
          En Agenda
        </Tag>
        <Tag
          color={getStatusTagColor("Confirmada")}
          onClick={() => handleStatusFilterClick("Confirmada")}
          style={{
            cursor: 'pointer',
            fontSize: '16px',
            padding: '8px 16px',
            borderRadius: '8px'
          }}
        >
          Confirmada
        </Tag>
        <Tag
          color={getStatusTagColor("Rechazada")}
          onClick={() => handleStatusFilterClick("Rechazada")}
          style={{
            cursor: 'pointer',
            fontSize: '16px',
            padding: '8px 16px',
            borderRadius: '8px'
          }}
        >
          Rechazada
        </Tag>
      </div>

      <Input
        type="text"
        placeholder="Buscar solicitud..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          marginBottom: '1rem',
          padding: '0.5rem',
          width: '300px',
          borderRadius: '8px',
          border: '1px solid #1890ff',
        }}
      />

      <Calendar
        localizer={localizer}
        events={filteredEvents}
        startAccessor="start"
        endAccessor="end"
        defaultView='month'
        views={['month', 'week', 'day', 'agenda']}
        onSelectEvent={handleEventClick}
        style={{ height: 600, backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}
        eventPropGetter={eventStyleGetter}
        messages={{
          date: 'Fecha',
          time: 'Hora',
          event: 'Evento',
          allDay: 'Todo el día',
          week: 'Semana',
          work_week: 'Semana laboral',
          day: 'Día',
          month: 'Mes',
          previous: 'Anterior',
          next: 'Siguiente',
          yesterday: 'Ayer',
          tomorrow: 'Mañana',
          today: 'Hoy',
          agenda: 'Agenda',
          noEventsInRange: 'No hay eventos en este rango.',
          showMore: (total) => `+ Ver más (${total})`
        }}
      />

      {selectedEvent && (
        <Modal
          title={
            <div>
              <Tag color={getStatusTagColor(selectedEvent.estado)}>{selectedEvent.estado}</Tag>
              <Title level={4} style={{ display: 'inline', marginLeft: '10px' }}>
                {selectedEvent.title}
              </Title>
            </div>
          }
          open={modalVisible}
          onOk={closeModal}
          onCancel={closeModal}
          footer={null}
          width={800}
          bodyStyle={{ padding: '20px', backgroundColor: '#f6f9fc' }}
        >
          {isSolicitudDetailsLoading ? (
            <Spin size="large" />
          ) : isSolicitudDetailsError ? (
            <Alert message="Error loading solicitud details" type="error" />
          ) : (
            <div>
              <Card
                bordered={false}
                style={{ marginBottom: '20px', backgroundColor: '#f0f2f5', borderRadius: '8px' }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Text strong>Usuario: </Text>
                    <Text>{solicitudDetails?.nombre} {solicitudDetails?.apellido}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Correo electrónico: </Text>
                    <Text>{solicitudDetails?.correo_electronico}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Técnico: </Text>
                    <Text>{selectedEvent.nombre} {selectedEvent.apellido || 'Desconocido'}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Dirección: </Text>
                    <Text>{solicitudDetails?.direccion}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Teléfono Fijo: </Text>
                    <Text>{solicitudDetails?.telefono_fijo}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Teléfono Móvil: </Text>
                    <Text>{solicitudDetails?.telefono}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Fecha Cita: </Text>
                    <Text>{moment(solicitudDetails?.fecha_preferencia).format('YYYY-MM-DD HH:mm')}</Text>
                  </Col>
                  <Col span={12}>
                    <Text strong>Observación: </Text>
                    <Text>{solicitudDetails?.observacion || 'Ninguna'}</Text>
                  </Col>
                </Row>
              </Card>

              {solicitudDetails?.servicios?.length > 0 && (
                <>
                  <Title level={5}>Servicios Solicitados</Title>
                  {solicitudDetails.servicios.map((servicio, index) => (
                    <Card
                      key={index}
                      title={servicio.servicio_nombre}
                      bordered={true}
                      style={{ marginBottom: '15px', borderRadius: '8px' }}
                    >
                      <List
                        dataSource={servicio.detalles || []}
                        renderItem={(detalle) => (
                          <List.Item style={{ justifyContent: 'start' }}>
                            <CheckCircleOutlined style={{ color: 'green', marginRight: 30 }} />
                            <Text>{detalle}</Text>
                          </List.Item>
                        )}
                      />
                    </Card>
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