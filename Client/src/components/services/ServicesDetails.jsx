import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Accordion } from 'react-bootstrap';
import { useGetServiceByIdQuery } from '../../features/services/ServicesApiSlice';
import { Button, Skeleton, Tag, Timeline, Card, Row, Col } from 'antd';
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
  const [isRequestConfirmed, setIsRequestConfirmed] = useState(false);

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
          setIsRequestConfirmed(true); // Disable button after request is confirmed
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
            <Row gutter={[16, 16]}>

              {/* Left Column - Accordion with Categories */}
              <Col xs={24} md={12} className="p-2">
                <div className="content pb-3">
                  <h3><strong>{service?.nombre}</strong></h3>
                </div>
                <div className="accordion-list mb-5">
                  <Toast ref={toast} position="top-left" />
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
              </Col>

              {/* Right Column - Carousel and Button */}
              <Col xs={24} md={12} className="p-2">
                <Card
                  style={{ boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", padding: "20px", marginTop: "75px", borderRadius: "12px" }}
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
                          marginBottom: "20px",
                        }}
                        icon={<CheckCircleOutlined />}
                      >
                        {categoria.nombre}
                      </Tag>
                    ))}
                  </div>
                  <ServicesCarousel images={service?.imagenes} />

                  <Button
                    className="btn btn-info btn-block d-flex justify-content-center mt-5 btn-animated-border pt-2"
                    onClick={handleServiceRequest}
                    disabled={selectedOffers.length === 0}
                    style={{
                      fontSize: '0.85em',
                      padding: '0.3rem 0.6rem',
                      width: '100%',
                    }}
                  >
                    Solicitar Servicio
                  </Button>

                </Card>
              </Col>
            </Row>
          </motion.div>
        )}
      </div>
    </section>
  );
}
