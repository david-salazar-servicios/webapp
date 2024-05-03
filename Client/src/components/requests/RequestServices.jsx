import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Card, Button, Typography, Steps, Input } from 'antd';
import { useCreateSolicitudWithDetailsMutation } from "../../features/RequestService/RequestServiceApiSlice";
import { Calendar } from 'primereact/calendar';
import { DeleteOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Toast } from 'primereact/toast';
import ServicesHook from "../../hooks/services/ServicesHook";

const { Title, Text } = Typography;
const { Step } = Steps;

export default function RequestServices() {
    const [current, setCurrent] = useState(0);
    const [updatedServicesDetails, setUpdatedServicesDetails] = useState([]);
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
    };

    useEffect(() => {
        updateServicesFromStorage();

        const handleStorageChange = () => updateServicesFromStorage();
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('serviceAdded', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('serviceAdded', handleStorageChange);
        };
    }, []);

    const onFinish = async (values) => {
        const date = new Date(values.fecha_preferencia);
        date.setSeconds(0);
        date.setMilliseconds(0);
    
        const solicitudDetails = {
            ...values,
            estado: 'Pendiente',
            id_usuario: null,
            fecha_creacion: new Date().toISOString(),
            fecha_preferencia: date.toISOString(),
            servicios: updatedServicesDetails.map(detail => detail.id_servicio),
        };
    
        try {
            await createSolicitudWithDetails(solicitudDetails).unwrap();
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Solicitud enviada con éxito', life: 3000 });
            form.resetFields();
            setCurrent(0);
            localStorage.removeItem('serviceRequests');
            const event = new Event('serviceAdded');
            window.dispatchEvent(event);
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar la solicitud', life: 3000 });
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
            const event = new Event('serviceAdded');
            window.dispatchEvent(event);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'El servicio ha sido eliminado correctamente', life: 3000 });
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
                            <ServicesHook key={index} serviceId={serviceDetail.id_servicio} onDelete={handleDelete} />
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
                            <Row>
                                <Col xs={24} sm={12}>
                                    <Form.Item
                                        name="fecha_preferencia"
                                        label="Fecha Preferencia"
                                        rules={[{ required: true, message: 'Por favor seleccione la fecha y hora de preferencia' }]}
                                    >
                                        <Calendar showTime hourFormat="12" stepMinute={15} />
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
            <div className="d-flex justify-content-center align-items-center mb-4 mt-5">
                <Title level={2} className="fw-normal mb-0 text-black section-title">
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
