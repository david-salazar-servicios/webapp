import {React,useRef} from "react";
import { useParams } from "react-router-dom";
import { Accordion } from 'react-bootstrap';
import { useGetServiceByIdQuery, useAddUserServiceMutation } from '../../features/services/ServicesApiSlice';
import useAuth from "../../hooks/useAuth";
import image from '../../assets/images/why-us-bg.jpg'
import CarouselHeader from "../home/CarouselHeader";
import { Button } from 'antd';
import { Toast } from 'primereact';
export default function ServicesDetails() {
  const { id: serviceId } = useParams();
  const { data: service, isError, isLoading } = useGetServiceByIdQuery(serviceId);
  const [addUserService, { isLoading: isAddingUser }] = useAddUserServiceMutation();
  const { userId } = useAuth() || {};
  const toast = useRef(null);
  // Función para manejar el envío de la solicitud del servicio
  const handleServiceRequest = async () => {
    if (userId && serviceId) {
      try {
        console.log(userId, serviceId);
        await addUserService({ id_usuario: userId, id_servicio: serviceId }).unwrap();
        // If addUserService is successful, show a success message
        toast.current.show({ severity: 'success', summary: 'Servicio agregado', detail: 'El servicio ha sido agregado a la lista de solicitudes correctamente', life: 2000  });
      } catch (error) {
        // Extract error message depending on the structure of the error object
        const errorMessage = error.data.error;
        // Check if the error message is about the unique constraint violation
        if (errorMessage.includes('llave duplicada viola restricción de unicidad')) {
          // Show a message indicating that the service is already added
          toast.current.show({ severity: 'info', summary: 'Servicio ya agregado', detail: 'Este servicio ya ha sido agregado a la lista de solicitudes', life: 2000  });
        } else {
          // For other errors, you might want to handle them differently
          toast.current.show({ severity: 'error', summary: 'Error al agregar servicio', detail: `No se ha podido agregar el servicio: ${errorMessage}`, life: 2000  });
        }
      }
    };
    
    
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
                {/* Deja este bloque igual, ya que solicitaste que no se modifique */}
                <Accordion defaultActiveKey="0">
                  <Accordion.Item eventKey="0" className="accordionItem">
                    <Accordion.Header className="accordionHeader"><span>01</span> Non consectetur a erat nam at lectus urna duis?</Accordion.Header>
                    <Accordion.Body className="accordionBody">
                      Feugiat pretium nibh ipsum consequat. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Venenatis lectus magna fringilla urna porttitor rhoncus dolor purus non.
                    </Accordion.Body>
                  </Accordion.Item>
                  {/* Agrega más ítems de acordeón aquí si es necesario */}
                </Accordion>
              </div>
              <div className="row">
                <div className="col text-right pt-5">
                  <Button type="primary" size="large" onClick={handleServiceRequest} loading={isAddingUser}>Solicitar Servicios</Button>
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
