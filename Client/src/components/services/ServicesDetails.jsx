import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { Accordion } from 'react-bootstrap';
import { useGetServiceByIdQuery } from '../../features/services/ServicesApiSlice';
import { Button, Skeleton, Tag, Timeline } from 'antd';
import { Toast } from 'primereact/toast';
import ServicesCarousel from './ServicesCarousel'; // Import the new Carousel component
import { CheckCircleOutlined } from '@ant-design/icons';

export default function ServicesDetails() {
  const { id: serviceId } = useParams();
  const { data: service, isError, isLoading } = useGetServiceByIdQuery(serviceId);
  const toast = useRef(null);

  // Function to handle the storage of the service request
  const handleServiceRequest = () => {
    if (serviceId) {
      try {
        // Retrieve the existing services from localStorage or initialize with an empty array
        let serviceRequests = JSON.parse(localStorage.getItem('serviceRequests')) || [];

        // Check if the service is already in the localStorage
        const serviceExists = serviceRequests.some(req => req.id_servicio === serviceId);

        if (serviceExists) {
          // Show a message indicating that the service is already added
          toast.current.show({ severity: 'info', summary: 'Servicio ya agregado', detail: 'Este servicio ya ha sido agregado a la lista de solicitudes', life: 2000 });
        } else {
          // Add the new service request to the list
          serviceRequests.push({ id_servicio: serviceId, nombre: service.nombre });

          // Update localStorage with the new list
          localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));

          // Emit custom event to notify Header component
          const event = new Event('serviceAdded');
          window.dispatchEvent(event);

          // If successfully stored, show a success message
          toast.current.show({ severity: 'success', summary: 'Servicio agregado', detail: 'El servicio ha sido agregado a la lista de solicitudes correctamente', life: 2000 });
        }
      } catch (error) {
        // For other errors, handle them differently
        toast.current.show({ severity: 'error', summary: 'Error al agregar servicio', detail: `No se ha podido agregar el servicio: ${error.message}`, life: 2000 });
      }
    }
  };

  return (
    <>
      <section id="serviceDetail" className="serviceDetail section-bg">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch order-2 order-lg-1">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', padding: '10px' }}>
                {service?.categorias.map(categoria => (
                  <Tag
                    key={categoria.nombre}
                    style={{
                      padding: "10px 20px",
                      fontSize: "16px",
                      borderRadius: "12px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#eaffea",
                      color: "#52c41a"
                    }}
                    icon={<CheckCircleOutlined />}
                  >
                    {categoria.nombre}
                  </Tag>
                ))}
              </div>

              <Skeleton loading={isLoading} active>
                <div className="content pt-3">
                  <h3><strong>{service?.nombre}</strong></h3>
                </div>

                <div className="accordion-list">
                  <Toast ref={toast} />
                  <Accordion defaultActiveKey="1" style={{paddingTop:"10px"}}>
                    <Accordion.Item eventKey="1" className="accordionItem">
                      <Accordion.Header className="accordionHeader"><span>Qué es este servicio?</span></Accordion.Header>
                      <Accordion.Body className="accordionBody">
                        <p>{service?.descripcion}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <Accordion defaultActiveKey="0" style={{paddingTop:"10px"}}>
                    <Accordion.Item eventKey="0" className="accordionItem">
                      <Accordion.Header className="accordionHeader"><span> Lo que ofrecemos</span></Accordion.Header>
                      <Accordion.Body className="accordionBody">
                        <Timeline>
                          {service?.offers?.map((offer, index) => (
                            <Timeline.Item key={index}>{offer}</Timeline.Item>
                          ))}
                        </Timeline>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
                <div className="row">
                  <div className="col text-right pt-5">
                    <Button type="primary" size="large" onClick={handleServiceRequest}>Solicitar Servicios</Button>
                  </div>
                </div>
              </Skeleton>
            </div>

            <div className="col-lg-5 align-items-stretch order-1 order-lg-2">
              <Skeleton loading={isLoading} active>
                <ServicesCarousel images={service?.imagenes} />
              </Skeleton>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
