import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Card, Button, Typography, Steps, Input, Divider } from 'antd';
import { useCreateSolicitudWithDetailsMutation } from "../../features/RequestService/RequestServiceApiSlice";
import { Calendar } from 'primereact/calendar';
import { DeleteOutlined, LeftOutlined, RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Toast } from 'primereact/toast';

const { Title, Text } = Typography;
const { Step } = Steps;

export default function RequestServices() {
    const [current, setCurrent] = useState(0);
    const [updatedServicesDetails, setUpdatedServicesDetails] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false); // New state flag
    const [createSolicitudWithDetails, { isLoading: isSubmitting }] = useCreateSolicitudWithDetailsMutation();
    const [form] = Form.useForm();
    const toast = useRef(null);

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
            toast.current.show({
                severity: 'warn',
                summary: 'Advertencia',
                detail: 'No hay servicios para confirmar, volviendo al paso de selección.',
                life: 3000
            });
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
        // Format the preference date to have 0 seconds and milliseconds
        const date = new Date(values.fecha_preferencia);
        date.setSeconds(0);
        date.setMilliseconds(0);

        // Prepare the request payload
        const solicitudDetails = {
            ...values,
            estado: 'Pendiente',
            id_usuario: null, // You can replace this with the actual user id if available
            fecha_creacion: new Date().toISOString(),
            fecha_preferencia: date.toISOString(),
            servicios: updatedServicesDetails.map(detail => ({
                id_servicio: detail.id_servicio,
                selectedOffers: detail.selectedOffers
            })),
        };

        try {
            // Send the request to the API
            await createSolicitudWithDetails(solicitudDetails).unwrap();

            // Show a success message
            toast.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Solicitud enviada con éxito',
                life: 3000
            });

            // Reset the form and state
            form.resetFields();
            setCurrent(0); // Go back to the first step

            // Clean up the specific `selectedOffers_<serviceId>` keys from localStorage
            updatedServicesDetails.forEach(service => {
                localStorage.removeItem(`selectedOffers_${service.id_servicio}`);
            });

            // Remove the main `serviceRequests` key from localStorage
            localStorage.removeItem('serviceRequests');

            // Set the flag to true after successful submission
            setIsSubmitted(true);

            // Dispatch an event to update the component state
            const event = new Event('serviceUpdated');
            window.dispatchEvent(event);

            // Reset the flag after a short delay to avoid future interference
            setTimeout(() => setIsSubmitted(false), 1000);

        } catch (error) {
            // Handle any errors and show an error message
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Error al enviar la solicitud',
                life: 3000
            });
        }
    };


    const onReset = () => {
        form.resetFields();
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
                toast.current.show({
                    severity: 'warn',
                    summary: 'Advertencia',
                    detail: 'No hay servicios para confirmar, volviendo al paso de selección.',
                    life: 3000
                });
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
                    {
                        updatedServicesDetails.length > 0 ? (
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
                                        <ul style={{ marginTop: '10px', paddingLeft: '20px', listStyleType: 'none' }}>
                                            {serviceDetail.selectedOffers.map((offer, i) => (
                                                <li key={i} style={{ marginBottom: '10px' }}>
                                                    <CheckCircleOutlined style={{ color: 'green', marginRight: '30px' }} />
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
                        )
                    }
                    <div>
                        <Button type="primary" style={{ margin: "20px" }} onClick={next}>
                            Siguiente <RightOutlined />
                        </Button>
                    </div>
                </div>
            )
        },
        {
            content: (
                <div>
                    <Card className="rounded-3 mb-4 shadow-sm">
                        <Form form={form} name="requestForm" layout="vertical" onFinish={onFinish} autoComplete="off">
                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="nombre"
                                        label="Nombre"
                                        rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
                                    >
                                        <Input placeholder="Ingrese su nombre" />
                                    </Form.Item>
                                    <Form.Item
                                        name="apellido"
                                        label="Apellido"
                                        rules={[{ required: true, message: 'Por favor ingrese su apellido' }]}
                                    >
                                        <Input placeholder="Ingrese su apellido" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="correo_electronico"
                                        label="Correo Electrónico"
                                        rules={[{ required: true, message: 'Por favor ingrese su correo electrónico', type: 'email' }]}
                                    >
                                        <Input placeholder="Ingrese su correo electrónico" />
                                    </Form.Item>
                                    <Form.Item
                                        name="telefono"
                                        label="Teléfono"
                                        rules={[{ required: true, message: 'Por favor ingrese su número de teléfono' }]}
                                    >
                                        <Input placeholder="Ingrese su número de teléfono" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={24}>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="direccion"
                                        label="Dirección"
                                        rules={[{ required: true, message: 'Por favor ingrese su dirección completa' }]}
                                    >
                                        <Input placeholder="Provincia/Cantón/Distrito, Otro detalle" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="fecha_preferencia"
                                        label="Fecha Preferencia"
                                        rules={[{ required: true, message: 'Por favor seleccione la fecha y hora de preferencia' }]}
                                        
                                    >
                                        <Calendar showTime hourFormat="12" stepMinute={15} style={{height:'32px'}} />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={24}>
                                    <Form.Item
                                        name="observacion"
                                        label="Observación"
                                    >
                                        <Input.TextArea rows={4} placeholder="Ingrese cualquier observación relevante" />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row justify="end">
                                <Col>
                                    <Button onClick={onReset}>
                                        Resetear
                                    </Button>
                                    <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }} disabled={isSubmitting}>
                                        Enviar
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card>

                    <Button type="primary" style={{ margin: "20px" }} onClick={prev}>
                        <LeftOutlined /> Anterior
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div style={{ width: '100%', padding: '0 10px' }}>
            <div className="d-flex justify-content-center align-items-center mb-4 pt-5">
                <Title level={2} className="fw-normal mb-0 text-black section-title pt-5">
                    <div className="section-title" data-aos="fade-up">
                        <h2>Proceso de Solicitud</h2>
                    </div>
                </Title>
            </div>
            <Toast ref={toast} />
            <div style={stepStyle}>
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
