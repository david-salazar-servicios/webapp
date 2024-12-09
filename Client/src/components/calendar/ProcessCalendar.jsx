import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react"; // Correct import for FullCalendar
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Modal, Spin, Alert, Input, Card, Typography, List, Row, Col, Tag } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import { useGetSolicitudesQuery, useGetSolicitudByIdQuery } from "../../features/RequestService/RequestServiceApiSlice";
import esLocale from '@fullcalendar/core/locales/es';
import moment from "moment";
import "moment-timezone";

const { Text, Title } = Typography;

const ProcessCalendar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeStatusFilter, setActiveStatusFilter] = useState("All");

  const { data: solicitudes, isLoading, isError, refetch } = useGetSolicitudesQuery();
  const { data: solicitudDetails, isLoading: isSolicitudDetailsLoading, isError: isSolicitudDetailsError } = useGetSolicitudByIdQuery(selectedEvent?.id, {
    skip: !selectedEvent,
  });

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleEventClick = (info) => {
    setSelectedEvent(info.event.extendedProps);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleStatusFilterClick = (status) => {
    setActiveStatusFilter(status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "En Agenda":
        return "#0EA5E9"; // Azul
      case "Confirmada":
        return "#22C55E"; // Verde
      case "Rechazada":
        return "#FF4D4F"; // Rojo
      case "Pendiente":
        return "#F97316"; // Naranja
      default:
        return "#3182CE"; // Azul oscuro por defecto
    }
  };

  const filteredEvents = solicitudes
    ?.filter(
      (solicitud) =>
        (activeStatusFilter === "All" || solicitud.estado === activeStatusFilter) &&
        (solicitud.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          solicitud.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
          solicitud.id_solicitud.toString().includes(searchTerm))
    )
    .map((solicitud) => ({
      title: `${solicitud.nombre || "Sin nombre"} ${solicitud.apellido || "Sin apellido"} | ID-${solicitud.id_solicitud}`, // Solo nombre y apellido
      start: moment(solicitud.fecha_preferencia).tz("America/Costa_Rica").format(), // Ajuste a la zona horaria
      end: moment(solicitud.fecha_preferencia).tz("America/Costa_Rica").format(),   // Ajuste a la zona horaria
      backgroundColor: getStatusColor(solicitud.estado),  
      extendedProps: {
        id: solicitud.id_solicitud,
        estado: solicitud.estado,
        nombre: solicitud.nombre,
        apellido: solicitud.apellido,
        correo: solicitud.correo_electronico,
        telefono: solicitud.telefono,
        observacion: solicitud.observacion,
      },
    }));


  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError) {
    return <Alert message="Error loading data" type="error" />;
  }

  return (
    <div style={{ height: "100%", padding: "20px" }}>
      <Card
        title="Filtros"
        bordered
        style={{ marginBottom: "20px", borderRadius: "8px" }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <Tag
            color="default"
            onClick={() => handleStatusFilterClick("All")}
            style={{
              cursor: "pointer",
              fontSize: "16px",
              padding: "8px 16px",
              borderRadius: "8px",
            }}
          >
            Todos
          </Tag>
          <Tag
            color={getStatusColor("En Agenda")}
            onClick={() => handleStatusFilterClick("En Agenda")}
            style={{
              cursor: "pointer",
              fontSize: "16px",
              padding: "8px 16px",
              borderRadius: "8px",
            }}
          >
            En Agenda
          </Tag>
          <Tag
            color={getStatusColor("Confirmada")}
            onClick={() => handleStatusFilterClick("Confirmada")}
            style={{
              cursor: "pointer",
              fontSize: "16px",
              padding: "8px 16px",
              borderRadius: "8px",
            }}
          >
            Confirmada
          </Tag>
          <Tag
            color={getStatusColor("Rechazada")}
            onClick={() => handleStatusFilterClick("Rechazada")}
            style={{
              cursor: "pointer",
              fontSize: "16px",
              padding: "8px 16px",
              borderRadius: "8px",
            }}
          >
            Rechazada
          </Tag>
          <Tag
            color={getStatusColor("Pendiente")}
            onClick={() => handleStatusFilterClick("Pendiente")}
            style={{
              cursor: "pointer",
              fontSize: "16px",
              padding: "8px 16px",
              borderRadius: "8px",
            }}
          >
            Pendiente
          </Tag>
        </div>
        <Input
          type="text"
          placeholder="Buscar solicitud..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            marginBottom: "1rem",
            padding: "0.5rem",
            width: "300px",
            borderRadius: "8px",
            border: "1px solid #1890ff",
          }}
        />
      </Card>

      <Card
        title="Calendario de Procesos"
        bordered
        style={{ borderRadius: "8px" }}
      >
        <div className="responsive-calendar-container">
          <FullCalendar
            locale={esLocale}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={filteredEvents}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            height="600px"
            className="responsive-calendar"
            eventTimeFormat={{
              hour: "numeric",
              minute: "2-digit",
              meridiem: "short", // AM/PM format
            }}
          />
        </div>




      </Card>

      {selectedEvent && (
        <Modal
          title={
            <div>
              <Tag color={getStatusColor(selectedEvent.estado)}>{selectedEvent.estado}</Tag>
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
                    <Text>
                      {solicitudDetails?.tecnico?.nombre && solicitudDetails?.tecnico?.apellido
                        ? `${solicitudDetails.tecnico.nombre} ${solicitudDetails.tecnico.apellido}`
                        : 'No definido'}
                    </Text>

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
                    <Text>
                      {moment(solicitudDetails?.fecha_preferencia)
                        .tz("America/Costa_Rica")
                        .format("DD-MM-YYYY h:mm A")}
                    </Text>
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
