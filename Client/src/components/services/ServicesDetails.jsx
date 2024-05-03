import React, { useRef } from "react";
import { useParams } from "react-router-dom";
import { Accordion } from 'react-bootstrap';
import { useGetServiceByIdQuery } from '../../features/services/ServicesApiSlice';
import image from '../../assets/images/why-us-bg.jpg'
import CarouselHeader from "../home/CarouselHeader";
import { Button } from 'antd';
import { Toast } from 'primereact';

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
        const serviceExists = serviceRequests.some(service => service.id_servicio === serviceId);
        
        if (serviceExists) {
          // Show a message indicating that the service is already added
          toast.current.show({ severity: 'info', summary: 'Servicio ya agregado', detail: 'Este servicio ya ha sido agregado a la lista de solicitudes', life: 2000 });
        } else {
          // Add the new service request to the list
          serviceRequests.push({ id_servicio: serviceId, nombre: service?.nombre });

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !service) {
    return <div>Service not found</div>;
  }

  return (
    <>
      <section id="serviceDetail" className="serviceDetail section-bg">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch order-2 order-lg-1">
              <div className="content">
                <h3><strong>{service.nombre}</strong></h3>
                <p>{service.descripcion}</p>
              </div>

              <div className="accordion-list">
                <Toast ref={toast} />
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0" className="accordionItem">
                    <Accordion.Header className="accordionHeader"><span>01</span> Non consectetur a erat nam at lectus urna duis?</Accordion.Header>
                    <Accordion.Body className="accordionBody">
                      Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </div>
              <div className="row">
                <div className="col text-right pt-5">
                  <Button type="primary" size="large" onClick={handleServiceRequest}>Solicitar Servicios</Button>
                </div>
              </div>
            </div>

            <div className="col-lg-5 align-items-stretch order-1 order-lg-2 imgService" style={{ backgroundImage: `url(${image})` }}></div>
          </div>

        </div>
      </section>
    </>
  );
}
