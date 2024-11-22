import React, { useEffect, useRef, useState } from "react";
import { Accordion } from "react-bootstrap";
import { useGetServicesQuery } from "../../features/services/ServicesApiSlice";
import { Button, Skeleton, Tag, Timeline, Card, Row, Col } from "antd";
import { Toast } from "primereact/toast";
import { motion } from "framer-motion";
import RequestServices from "../requests/RequestServices";
    
export default function CrearSolicitud() {
    const { data, isError, isLoading } = useGetServicesQuery();
    const toast = useRef(null);

    const [activeKeys, setActiveKeys] = useState([]);
    const [selectedOffers, setSelectedOffers] = useState({});

    useEffect(() => {
        const savedOffers = JSON.parse(localStorage.getItem("selectedOffers")) || {};
        setSelectedOffers(savedOffers);
    }, []);

    const handleServiceRequest = (serviceId, serviceName) => {
        const offers = selectedOffers[serviceId] || [];
        if (offers.length > 0) {
            try {
                let serviceRequests = JSON.parse(localStorage.getItem("serviceRequests")) || [];
                serviceRequests = serviceRequests.filter((req) => req.id_servicio !== serviceId);

                const newService = { id_servicio: serviceId, nombre: serviceName, selectedOffers: offers };
                serviceRequests.push(newService);

                localStorage.setItem("serviceRequests", JSON.stringify(serviceRequests));
                window.dispatchEvent(new Event("serviceUpdated"));

                toast.current.show({
                    severity: "success",
                    summary: "Servicio actualizado",
                    detail: "El servicio ha sido actualizado en la lista de solicitudes",
                    life: 2000,
                });
            } catch (error) {
                toast.current.show({
                    severity: "error",
                    summary: "Error al actualizar servicio",
                    detail: `No se ha podido actualizar el servicio: ${error.message}`,
                    life: 2000,
                });
            }
        } else {
            toast.current.show({
                severity: "warn",
                summary: "Ninguna oferta seleccionada",
                detail: "Por favor selecciona al menos una oferta antes de solicitar el servicio",
                life: 2000,
            });
        }
    };

    const handleCheckboxChange = (serviceId, offer) => {
        setSelectedOffers((prevSelected) => {
            const currentOffers = prevSelected[serviceId] || [];
            let updatedOffers;

            if (currentOffers.includes(offer)) {
                updatedOffers = currentOffers.filter((item) => item !== offer);
            } else {
                updatedOffers = [...currentOffers, offer];
            }

            const updatedSelected = { ...prevSelected, [serviceId]: updatedOffers };

            if (updatedOffers.length === 0) {
                delete updatedSelected[serviceId];
            }

            localStorage.setItem("selectedOffers", JSON.stringify(updatedSelected));
            return updatedSelected;
        });
    };

    const handleAccordionClick = (key) => {
        setActiveKeys((prevKeys) =>
            prevKeys.includes(key) ? prevKeys.filter((k) => k !== key) : [...prevKeys, key]
        );
    };

    if (isLoading) {
        return <Skeleton active />;
    }

    if (isError) {
        return <p>Error al cargar los servicios.</p>;
    }

    const { servicios, categorias, offers } = data;

    return (
        <>
        <RequestServices/>
        <section id="servicesList" className="servicesList section-bg">
            <div className="container-fluid">
                <Row gutter={[16, 16]} className="services-list">
                    {servicios?.map((service) => {
                        const serviceOffers = offers.find((o) => o.id_servicio === service.id_servicio)?.offerData || [];

                        return (
                            <Col key={service.id_servicio} xs={24} md={12} className="p-3">
                                <motion.div
                                    className="service-card"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <Card className="h-100">
                                        <h3 className="text-center">{service.nombre}</h3>
                                        <div className="accordion-list mb-4">
                                            <Toast ref={toast} position="top-left" />
                                            <Accordion defaultActiveKey={activeKeys} activeKey={activeKeys} alwaysOpen>
                                                <Accordion.Item eventKey={`offers-${service.id_servicio}`}>
                                                    <Accordion.Header onClick={() => handleAccordionClick(`offers-${service.id_servicio}`)}>
                                                        Selecciona lo que deseas solicitar:
                                                    </Accordion.Header>
                                                    <Accordion.Body>
                                                        <Timeline
                                                            items={serviceOffers.map((offer, index) => ({
                                                                key: index,
                                                                dot: (
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedOffers[service.id_servicio]?.includes(offer)}
                                                                        onChange={() => handleCheckboxChange(service.id_servicio, offer)}
                                                                    />
                                                                ),
                                                                children: offer,
                                                            }))}
                                                        />
                                                    </Accordion.Body>
                                                </Accordion.Item>
                                            </Accordion>
                                        </div>
                                        <Button
                                            className="btn btn-info w-100"
                                            onClick={() => handleServiceRequest(service.id_servicio, service.nombre)}
                                            disabled={!selectedOffers[service.id_servicio]?.length}
                                        >
                                            Solicitar Servicio
                                        </Button>
                                    </Card>
                                </motion.div>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        </section>
        </>
    );
}
