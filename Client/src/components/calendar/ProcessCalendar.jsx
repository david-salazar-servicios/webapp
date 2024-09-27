import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal, Spin, Alert, Input, Card, Typography, List, Row, Col } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { useGetAllCitasQuery } from "../../features/cita/CitaApiSlice";
import { useGetSolicitudByIdQuery } from "../../features/RequestService/RequestServiceApiSlice";

const { Text, Title } = Typography;
const localizer = momentLocalizer(moment);

const ProcessCalendar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch citas and solicitud details
  const { data: citas, isLoading: isCitasLoading, isError: isCitasError, refetch: refetchCitas } = useGetAllCitasQuery();
  const { data: solicitudDetails, isLoading: isSolicitudDetailsLoading, isError: isSolicitudDetailsError } = useGetSolicitudByIdQuery(selectedEvent?.solicitudId, {
    skip: !selectedEvent
  });

  // Refetch citas whenever the component is rendered
  useEffect(() => {
    refetchCitas();
  }, [refetchCitas]);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Filter events based on search term
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
      end: new Date(cita.datetime), // Only one time
      desc: `Estado: ${cita.estado}`,
      solicitudId: cita.id_solicitud,
      tecnicoId: cita.id_tecnico,
      tecnicoNombre: cita.tecnico_nombre,
      tecnicoApellido: cita.tecnico_apellido
    }))

  if (isCitasLoading) {
    return <Spin size="large" />;
  }

  if (isCitasError) {
    return <Alert message="Error loading data" type="error" />;
  }

  return (
    <div style={{ height: "100%", padding: '20px' }}>
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
  events={events}
  startAccessor="start"
  endAccessor="end"
  defaultView='month'
  views={['month', 'week', 'day', 'agenda']}
  onSelectEvent={handleEventClick}
  style={{ height: 600, backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px' }}
  components={{
    event: ({ event }) => (
      <span>{`Solicitud ${event.solicitudId} - ${event.tecnicoNombre} ${event.tecnicoApellido}`}</span>
    ),
  }}
  formats={{
    timeGutterFormat: 'h:mm A', // Only shows one time in the gutter
    eventTimeRangeFormat: ({ start }) => moment(start).format('h:mm A'), // Custom format for event time
  }}
/>

      {/* Modal for displaying solicitud details */}
      {selectedEvent && (
        <Modal
          title={<Title level={4}>{selectedEvent.title}</Title>}
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
                    <Text>{selectedEvent.tecnicoNombre} {selectedEvent.tecnicoApellido || 'Desconocido'}</Text>
                  </Col>

                  <Col span={12}>
                    <Text strong>Teléfono: </Text>
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
