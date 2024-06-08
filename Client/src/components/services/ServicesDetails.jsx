import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Accordion } from 'react-bootstrap';
import { useGetServiceByIdQuery } from '../../features/services/ServicesApiSlice';
import { Button, Skeleton, Tag, Timeline } from 'antd';
import { Toast } from 'primereact/toast';
import ServicesCarousel from './ServicesCarousel';
import { CheckCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

export default function ServicesDetails() {
  const { id: serviceId } = useParams();
  const { data: service, isError, isLoading } = useGetServiceByIdQuery(serviceId);
  const toast = useRef(null);

  const [activeKeys, setActiveKeys] = useState(['0', '1']);

  const handleServiceRequest = () => {
    if (serviceId) {
      try {
        let serviceRequests = JSON.parse(localStorage.getItem('serviceRequests')) || [];
        const serviceExists = serviceRequests.some(req => req.id_servicio === serviceId);

        if (serviceExists) {
          toast.current.show({ severity: 'info', summary: 'Servicio ya agregado', detail: 'Este servicio ya ha sido agregado a la lista de solicitudes', life: 2000 });
        } else {
          serviceRequests.push({ id_servicio: serviceId, nombre: service.nombre });
          localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));
          window.dispatchEvent(new Event('serviceAdded'));
          toast.current.show({ severity: 'success', summary: 'Servicio agregado', detail: 'El servicio ha sido agregado a la lista de solicitudes correctamente', life: 2000 });
        }
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error al agregar servicio', detail: `No se ha podido agregar el servicio: ${error.message}`, life: 2000 });
      }
    }
  };

  const handleAccordionClick = (key) => {
    setActiveKeys((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter(k => k !== key)
        : [...prevKeys, key]
    );
  };

  return (
    <section id="serviceDetail" className="serviceDetail section-bg">
      <div className="container-fluid">
        <div className="row">
          {isLoading ? (
            <>
              <div className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch order-2 order-lg-1">
                <Skeleton active />
              </div>
              <div className="col-lg-5 align-items-stretch order-1 order-lg-2">
                <Skeleton active />
              </div>
            </>
          ) : (
            <>
              <motion.div 
                key={serviceId} // Unique key to trigger animation on render
                className="col-lg-7 d-flex flex-column justify-content-center align-items-stretch order-2 order-lg-1"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="">
                  <div style={{ display: 'flex'}}>
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
                  <div className="content pt-3">
                    <h3><strong>{service?.nombre}</strong></h3>
                  </div>
                  <div className="accordion-list">
                    <Toast ref={toast} />
                    <Accordion defaultActiveKey={activeKeys} activeKey={activeKeys} alwaysOpen className="pt-3">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header onClick={() => handleAccordionClick('0')}>¿Qué es este servicio?</Accordion.Header>
                        <Accordion.Body>
                          <p>{service?.descripcion}</p>
                        </Accordion.Body>
                      </Accordion.Item>
                      <Accordion.Item eventKey="1">
                        <Accordion.Header onClick={() => handleAccordionClick('1')}>Lo que ofrecemos</Accordion.Header>
                        <Accordion.Body>
                          <Timeline>
                            {service?.offers?.map((offer, index) => (
                              <Timeline.Item key={index}>{offer}</Timeline.Item>
                            ))}
                          </Timeline>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </div>
                  <div className="text-right pt-5">
                    <Button type="primary" size="large" onClick={handleServiceRequest}>Solicitar Servicios</Button>
                  </div>
                </div>
              </motion.div>

              <motion.div 
                key={`${serviceId}-carousel`} // Unique key to trigger animation on render
                className="col-lg-5 align-items-stretch order-1 order-lg-2"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <ServicesCarousel images={service?.imagenes} />
              </motion.div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
