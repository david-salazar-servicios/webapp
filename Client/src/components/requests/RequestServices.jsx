import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Card, Button, Typography, Steps, Input, Divider } from 'antd';
import { useCreateSolicitudWithDetailsMutation } from "../../features/RequestService/RequestServiceApiSlice";
import { DeleteOutlined, LeftOutlined, RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useSendGenericEmailMutation } from '../../features/contacto/sendGenericEmailApiSlice';
import { Toast } from 'primereact/toast';
import FormularioSolicitud from "./FormularioSolicitud";
import { useNavigate, useLocation } from 'react-router-dom'; // Import hooks

const { Title, Text } = Typography;
const { Step } = Steps;

export default function RequestServices() {
    const [current, setCurrent] = useState(0);
    const [sendGenericEmail] = useSendGenericEmailMutation();
    const [updatedServicesDetails, setUpdatedServicesDetails] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [createSolicitudWithDetails, { isLoading: isSubmitting }] = useCreateSolicitudWithDetailsMutation();
    const [form] = Form.useForm();
    const toast = useRef(null);
    const navigate = useNavigate(); // Initialize navigation
    const location = useLocation(); // Get current URL location

    const stepStyle = {
        maxWidth: 700,
        margin: '0 auto',
    };

    const updateServicesFromStorage = () => {
        const storedServices = JSON.parse(localStorage.getItem('serviceRequests')) || [];
        setUpdatedServicesDetails(storedServices);

        // Prevent the toast warning and step reset if the form was just submitted
        if (!isSubmitted && storedServices.length === 0 && current === 1) {
            setCurrent(0);
        }
    };

    useEffect(() => {
        updateServicesFromStorage();

        const handleStorageChange = () => updateServicesFromStorage();
        const handleServiceUpdated = () => updateServicesFromStorage();

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('serviceUpdated', handleServiceUpdated);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('serviceUpdated', handleServiceUpdated);
        };
    }, [current]);


    const onFinish = async (values) => {
        console.log("form:",values)
        const { fechasFrecuencia = [] } = values;

        // If no frequency, use single date
        if (fechasFrecuencia.length === 0) {
            fechasFrecuencia.push(values.fecha_preferencia);
        }

        try {
            const fechasEnviadas = []; // Store all sent dates

            // Create individual requests for each date
            for (const fecha of fechasFrecuencia) {
                const solicitudDetails = {
                    ...values,
                    estado: "Pendiente",
                    id_usuario: null,
                    fecha_creacion: new Date().toISOString(),
                    fecha_preferencia: new Date(fecha).toISOString(),
                    servicios: updatedServicesDetails.map((detail) => ({
                        id_servicio: detail.id_servicio,
                        selectedOffers: detail.selectedOffers,
                    })),
                };

                await createSolicitudWithDetails(solicitudDetails).unwrap();
                fechasEnviadas.push(new Date(fecha).toLocaleDateString("es-ES"));
            }

            // Display success notification
            if (toast.current) {
                toast.current.show({
                    severity: "success",
                    summary: "Éxito",
                    detail: "Todas las solicitudes fueron enviadas con éxito",
                    life: 3000,
                });
            }
            if (!location.pathname.includes("mantenimiento")) {
                await sendGenericEmail({
                    nombre: values.nombre,
                    correo: values.correo_electronico,
                    mensaje: `<p>Gracias por enviar tu solicitud de servicio. Hemos recibido tu petición y la estaremos procesando.</p>`,
                    telefono: `${values.telefono}${values.telefono_fijo ? ' / ' + values.telefono_fijo : ''}`,
                    type: "NuevaSolicitud",
                }).unwrap();
                
            }
            // Clean up state and redirect
            setCurrent(0);
            updatedServicesDetails.forEach((service) => {
                localStorage.removeItem(`selectedOffers_${service.id_servicio}`);
            });
            localStorage.removeItem("serviceRequests");
            setIsSubmitted(true);

            const event = new Event("serviceUpdated");
            window.dispatchEvent(event);

            setTimeout(() => setIsSubmitted(false), 1000);

            if (location.pathname.includes("mantenimiento")) {
                navigate("/mantenimiento/solicitudes");
            }
        } catch (error) {
            if (toast.current) {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Ocurrió un error al enviar las solicitudes",
                    life: 3000,
                });
            }
        }
    };



    const handleDelete = (id_servicio) => {
        try {
            let serviceRequests = JSON.parse(localStorage.getItem('serviceRequests')) || [];
            serviceRequests = serviceRequests.filter(service => service.id_servicio !== id_servicio);
            localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));
            const event = new Event('serviceUpdated');
            window.dispatchEvent(event);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'El servicio ha sido eliminado correctamente', life: 3000 });

            // Check if there are no services left and move to step 1
            if (serviceRequests.length === 0 && current === 1) {
                setCurrent(0);
            }
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el servicio', life: 3000 });
        }
    };

    const next = () => {
        if (current === 0 && updatedServicesDetails.length === 0) {
            toast.current.show({ severity: 'warn', summary: 'Advertencia', detail: 'Por favor, seleccione al menos un servicio antes de continuar.', life: 3000 });
            return;
        }
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const stepsContent = [
        {
            content: (
                <div>
                    {updatedServicesDetails.length > 0 ? (
                        updatedServicesDetails.map((serviceDetail, index) => (
                            <Card key={index} className="rounded-3 mb-4 shadow-sm">
                                <div className="d-flex justify-content-between align-items-center">
                                    <Title level={4}>{serviceDetail.nombre}</Title>
                                    <Button
                                        icon={<DeleteOutlined />}
                                        type="link"
                                        danger
                                        onClick={() => handleDelete(serviceDetail.id_servicio)}
                                    />
                                </div>
                                <Divider />
                                {serviceDetail.selectedOffers && serviceDetail.selectedOffers.length > 0 ? (
                                    <ul style={{ marginTop: "10px", paddingLeft: "20px", listStyleType: "none" }}>
                                        {serviceDetail.selectedOffers.map((offer, i) => (
                                            <li key={i} style={{ marginBottom: "10px" }}>
                                                <CheckCircleOutlined style={{ color: "green", marginRight: "30px" }} />
                                                <Text>{offer}</Text>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <Text>No hay ofertas seleccionadas</Text>
                                )}
                            </Card>
                        ))
                    ) : (
                        <Text>No hay servicios para mostrar</Text>
                    )}
                    <div>
                        <Button type="primary" style={{ margin: "20px" }} onClick={next}>
                            Siguiente <RightOutlined />
                        </Button>
                    </div>
                </div>
            ),
        },
        {
            content: (
                <div>
                    <Card className="rounded-3 mb-4 shadow-sm">
                        <FormularioSolicitud
                            form={form}
                            onFinish={onFinish}
                            isSubmitting={isSubmitting}
                        />
                    </Card>
                    <Button type="primary" style={{ margin: "20px" }} onClick={prev}>
                        <LeftOutlined /> Anterior
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div style={{ width: "100%", padding: "0 10px" }}>
            <div className="d-flex justify-content-center align-items-center mb-4 pt-5">
                <Title level={2} className="fw-normal mb-0 text-black section-title pt-5">
                    <div className="section-title" data-aos="fade-up">
                        <h2>Proceso de Solicitud</h2>
                    </div>
                </Title>
            </div>
            <Toast ref={toast} />
            <div style={{ maxWidth: 700, margin: "0 auto" }}>
                <Steps current={current} onChange={setCurrent} direction="horizontal">
                    <Step title="Servicios Solicitados" />
                    <Step title="Confirmar Solicitud" />
                </Steps>
            </div>
            <Row justify="center" align="middle" className="h-100" style={{ marginTop: 20 }}>
                <Col xs={24} sm={24} md={20} lg={18} xl={16}>
                    {stepsContent[current]?.content}
                </Col>
            </Row>
        </div>
    );
}
