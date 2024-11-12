import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Accordion } from 'react-bootstrap';
import { useGetServiceByIdQuery } from '../../features/services/ServicesApiSlice';
import { Button, Skeleton, Tag, Timeline, Card } from 'antd';
import { Toast } from 'primereact/toast';
import ServicesCarousel from './ServicesCarousel';
import { CheckCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

export default function ServicesDetails() {
  const { id: serviceId } = useParams();
  const { data: service, isError, isLoading } = useGetServiceByIdQuery(serviceId);
  const toast = useRef(null);

  const [activeKeys, setActiveKeys] = useState(['0', '1']);
  const [selectedOffers, setSelectedOffers] = useState([]);

  useEffect(() => {
    const savedOffers = JSON.parse(localStorage.getItem(`selectedOffers_${serviceId}`)) || [];
    setSelectedOffers(savedOffers);
  }, [serviceId]);

  const handleServiceRequest = () => {
    if (serviceId && selectedOffers.length > 0) {
      try {
        let serviceRequests = JSON.parse(localStorage.getItem('serviceRequests')) || [];
        const serviceExists = serviceRequests.some(req => req.id_servicio === serviceId);

        if (serviceExists) {
          toast.current.show({ severity: 'info', summary: 'Servicio ya agregado', detail: 'Este servicio ya ha sido agregado a la lista de solicitudes', life: 2000 });
        } else {
          serviceRequests.push({ id_servicio: serviceId, nombre: service.nombre, selectedOffers });
          localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));
          window.dispatchEvent(new Event('serviceAdded'));
          toast.current.show({ severity: 'success', summary: 'Servicio agregado', detail: 'El servicio ha sido agregado a la lista de solicitudes correctamente', life: 2000 });
        }
      } catch (error) {
        toast.current.show({ severity: 'error', summary: 'Error al agregar servicio', detail: `No se ha podido agregar el servicio: ${error.message}`, life: 2000 });
      }
    }
  };

  const handleCheckboxChange = (offer) => {
    setSelectedOffers((prevSelected) => {
      let updatedOffers;
      if (prevSelected.includes(offer)) {
        updatedOffers = prevSelected.filter((item) => item !== offer);
      } else {
        updatedOffers = [...prevSelected, offer];
      }

      if (updatedOffers.length === 0) {
        localStorage.removeItem(`selectedOffers_${serviceId}`);
      } else {
        localStorage.setItem(`selectedOffers_${serviceId}`, JSON.stringify(updatedOffers));
      }

      return updatedOffers;
    });
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
        {isLoading ? (
          <Skeleton active />
        ) : (
          <motion.div
            key={serviceId}
            className="d-flex justify-content-center align-items-stretch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Left Card - Accordion with Categories */}
            <div className="col-6 p-2">

                <div className="content pb-3">
                  <h3><strong>{service?.nombre}</strong></h3>
                </div>
                <div className="accordion-list mb-5">
                  <Toast ref={toast} />
                  <Accordion defaultActiveKey={activeKeys} activeKey={activeKeys} alwaysOpen>
                    <Accordion.Item eventKey="0">
                      <Accordion.Header onClick={() => handleAccordionClick('0')}>¿Qué es este servicio?</Accordion.Header>
                      <Accordion.Body>
                        <p>{service?.descripcion}</p>
                      </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header onClick={() => handleAccordionClick('1')}>Selecciona lo que deseas solicitar:</Accordion.Header>
                      <Accordion.Body>
                        <Timeline
                          items={service?.offers?.map((offer, index) => ({
                            key: index,
                            dot: (
                              <input
                                type="checkbox"
                                checked={selectedOffers.includes(offer)}
                                onChange={() => handleCheckboxChange(offer)}
                              />
                            ),
                            children: offer,
                          }))}
                        />
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
            </div>

            {/* Right Card - Carousel and Button */}
            <div className="col-6 p-2">
              
              <Card
                style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", padding: "20px", marginTop:"75px", borderRadius: "12px" }}
              >
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {service?.categorias.map(categoria => (
                    <Tag
                      key={categoria.nombre}
                      style={{
                        padding: "10px 20px 10px",
                        fontSize: "16px",
                        borderRadius: "12px",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "#eaffea",
                        color: "#52c41a",
                        marginBottom:"20px",
                      }}
                      icon={<CheckCircleOutlined />}
                    >
                      {categoria.nombre}
                    </Tag>
                  ))}
                </div>
                <ServicesCarousel images={service?.imagenes} />
                <div className="text-right pt-5">
                  <Button
                    type="primary"
                    size="large"
                    onClick={handleServiceRequest}
                    disabled={selectedOffers.length === 0}
                  >
                    Solicitar Servicio
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
