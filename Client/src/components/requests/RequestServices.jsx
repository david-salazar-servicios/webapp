import React, { useState, useEffect, useRef } from "react";
import { Form, Row, Col, Card, Button, Typography, Steps, Empty, Input, message } from 'antd';
import { useCreateSolicitudWithDetailsMutation } from "../../features/RequestService/RequestServiceApiSlice";
import { DeleteOutlined } from '@ant-design/icons';
import { useGetUserServicesQuery, useDeleteUserServiceMutation, useGetServicesByIdsQuery,useDeleteAllUserServiceMutation } from '../../features/services/ServicesApiSlice';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useGetUserByIdQuery } from '../../features/users/UsersApiSlice';
import { Toast } from 'primereact';
import useAuth from "../../hooks/useAuth";

const { Title, Text } = Typography;
const { Step } = Steps;

export default function RequestServices() {
    const [current, setCurrent] = useState(0);
    const [updatedServicesDetails, setUpdatedServicesDetails] = useState([]);
    const [deleteService, { isLoading: isDeleting }] = useDeleteUserServiceMutation();
    const [deleteAllService] = useDeleteAllUserServiceMutation();
    const [createSolicitudWithDetails, { isLoading: isSubmitting, isSuccess: isSubmitSuccess }] = useCreateSolicitudWithDetailsMutation();

    const auth = useAuth() || {};
    const [form] = Form.useForm();

    const { data: userServices, isLoading: isLoadingUserServices } = useGetUserServicesQuery(auth.userId);

    let isEmpty = !userServices || userServices.length === 0;
    const toast = useRef(null);

    const serviceIds = isEmpty ? [] : userServices.map(service => service.id_servicio);
    const { data: userData, isSuccess } = useGetUserByIdQuery(auth.userId);
    const { data: servicesDetails } = useGetServicesByIdsQuery(serviceIds, { skip: isEmpty });

    const stepStyle = {
        maxWidth: 700, // Ajusta esto según tus necesidades
        margin: '0 auto', // Centra los steps
    };

    useEffect(() => {
        if (servicesDetails) {
            setUpdatedServicesDetails(servicesDetails);
        }
    }, [servicesDetails]);


    useEffect(() => {
        if (isSuccess && userData) {
            form.setFieldsValue({
                nombre: userData.nombre,
                apellido: userData.apellido,
                correo_electronico: userData.correo_electronico,
                telefono: userData.telefono,
            });
        }
    }, [userData, isSuccess, form]);


    const onFinish = async (values) => {
        const solicitudDetails = {
            ...values,
            id_usuario: auth.userId, 
            estado: 'Pendiente', 
            fecha_creacion: new Date().toISOString(), 
            servicios: updatedServicesDetails.map(detail => detail.id_servicio), 
        };
    
        try {
            await createSolicitudWithDetails(solicitudDetails).unwrap();
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Solicitud enviada con éxito', life: 3000 });
            // Acciones después del envío exitoso
            form.resetFields(); 
            setCurrent(0); 
            setUpdatedServicesDetails([]);
            await deleteAllService({ id_usuario: auth.userId }).unwrap();
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al enviar la solicitud', life: 3000 });
        }
    };
    

    const onReset = () => {
        form.resetFields();
    };

    const handleDelete = async (id_servicio) => {
        try {
            await deleteService({ id_servicio, id_usuario: auth.userId }).unwrap();
            setUpdatedServicesDetails(prevDetails => prevDetails.filter(service => service.id_servicio !== id_servicio));
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
                    {!isEmpty ? (
                        updatedServicesDetails.length > 0 ? (
                            updatedServicesDetails.map((service, index) => (
                                <Card className="rounded-3 mb-4 shadow-sm" key={index}>
                                    <Row justify="space-between" align="middle">
                                        <Col span={10}>
                                            <Title level={5} className="mb-2">{service.nombre}</Title>
                                        </Col>
                                        <Col span={10}>
                                            <Text>{service.descripcion}</Text>
                                        </Col>
                                        <Col span={50} className="text-end">
                                            <Button shape="circle" style={{
                                                backgroundColor: 'transparent',
                                                border: '1px solid white',
                                                boxShadow: 'none',
                                                color: "black",
                                                borderRadius: '10px'
                                            }} icon={<DeleteOutlined />} type="link" className="text-danger shadow-sm" onClick={() => handleDelete(service.id_servicio)} disabled={isDeleting} />
                                        </Col>
                                    </Row>

                                </Card>
                            ))

                        ) : (
                            <Text>No hay servicios para mostrar</Text>
                        )
                    ) : (
                        <Text><Empty description={false} /></Text>
                    )}
                    <div>
                        {/* Your services content */}
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
        },
        // Agrega más contenido de pasos según sea necesario
    ];

    return (
        <div style={{ width: '100%', padding: '0 10px' }}> {/* Ajusta el padding para la responsividad */}
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
                    <Step title="Confimar Solicitud" />
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