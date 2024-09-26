import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Input, ConfigProvider, Select, Button, Space, Spin, Row, Col, Card, Typography, List } from 'antd';
import { DatePicker as AntDatePicker } from 'antd';
import { useGetUsersQuery } from '../../features/users/UsersApiSlice';
import { useGetUsersRolesQuery, useGetRolesQuery } from '../../features/roles/RolesApiSlice';
import { useCreateCitaMutation, useUpdateCitaMutation, useGetAllCitasQuery } from '../../features/cita/CitaApiSlice';
import { useUpdateSolicitudEstadoMutation, useGetSolicitudByIdQuery, useUpdateSolicitudFechaPreferenciaMutation } from '../../features/RequestService/RequestServiceApiSlice';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import utc from 'dayjs/plugin/utc';
import enUS from 'antd/es/locale/en_US';
import { Toast } from 'primereact/toast';
import { CheckCircleOutlined } from '@ant-design/icons';

const { Option } = Select;
const { Text, Title } = Typography;

dayjs.extend(buddhistEra);
dayjs.extend(utc);

const buddhistLocale = {
    ...enUS,
    DatePicker: {
        ...enUS.DatePicker,
        lang: {
            ...enUS.DatePicker.lang,
            fieldDateFormat: 'YYYY-MM-DD',
            fieldDateTimeFormat: 'YYYY-MM-DD HH:mm',
            yearFormat: 'YYYY',
            cellYearFormat: 'YYYY',
        }
    }
};

export default function CitaForm({ visible, onClose, solicitudData, isUpdate }) {
    const [form] = Form.useForm();
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);

    const { data: users } = useGetUsersQuery();
    const { data: rolesData } = useGetRolesQuery();
    const { data: userRolesData, refetch: refetchUserRoles } = useGetUsersRolesQuery();
    const { data: citaData } = useGetAllCitasQuery();

    const { data: solicitudDetails, isLoading: isSolicitudLoading, refetch } = useGetSolicitudByIdQuery(solicitudData?.id_solicitud, {
        skip: !solicitudData?.id_solicitud
    });

    const [createCita, { isLoading: isCreating }] = useCreateCitaMutation();
    const [updateCita, { isLoading: isUpdating }] = useUpdateCitaMutation();
    const [updateSolicitudEstado] = useUpdateSolicitudEstadoMutation();
    const [updateSolicitudFechaPreferencia] = useUpdateSolicitudFechaPreferenciaMutation();

    useEffect(() => {
        if (users && userRolesData && rolesData) {
            const tecnicoRoleIds = rolesData.filter(role => role.nombre === 'Tecnico').map(role => role.id_rol);
            const technicianList = users.filter(user =>
                userRolesData.some(userRole =>
                    userRole.id_usuario === user.id_usuario && tecnicoRoleIds.includes(userRole.id_rol)
                )
            );
            setTechnicians(technicianList);
        }
    }, [users, userRolesData, rolesData]);

    useEffect(() => {
        const interval = setInterval(() => {
            refetchUserRoles();
        }, 500);
        return () => clearInterval(interval);
    }, [refetchUserRoles]);

    useEffect(() => {
        if (visible && solicitudData) {
            setLoading(true);
            refetch();
        }
    }, [visible, solicitudData, refetch]);

    useEffect(() => {
        if (visible && solicitudData && solicitudDetails && !isSolicitudLoading) {
            setLoading(false);

            const preferredDate = solicitudDetails.fecha_preferencia ? dayjs(solicitudDetails.fecha_preferencia) : null;

            const filteredCita = citaData?.find(cita => cita.id_solicitud === solicitudDetails.id_solicitud);

            form.resetFields();
            form.setFieldsValue({
                id_solicitud: solicitudDetails.id_solicitud,
                id_tecnico: filteredCita ? filteredCita.id_tecnico : '',
                datetime: filteredCita ? dayjs(filteredCita.datetime) : preferredDate,
            });
        }
    }, [solicitudDetails, form, solicitudData, visible, isSolicitudLoading, citaData]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            const filteredCita = citaData.find(cita => cita.id_solicitud === solicitudData.id_solicitud);

            const formattedDateTime = values.datetime ? dayjs(values.datetime).format('YYYY-MM-DDTHH:mm:ssZ') : null;

            if (isUpdate && filteredCita) {

                await updateCita({ ...values, id_cita: filteredCita.id_cita, datetime: formattedDateTime, estado: 'En Agenda' }).unwrap();

                if (formattedDateTime) {
                    await updateSolicitudFechaPreferencia({ id: values.id_solicitud, fecha_preferencia: formattedDateTime }).unwrap();
                }

                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'La cita ha sido actualizada correctamente',
                    life: 3000
                });
            } else {
                await createCita({ ...values, datetime: formattedDateTime }).unwrap();
                await updateSolicitudEstado({ id: values.id_solicitud, estado: 'En Agenda' }).unwrap();

                if (formattedDateTime) {
                    await updateSolicitudFechaPreferencia({ id: values.id_solicitud, fecha_preferencia: formattedDateTime }).unwrap();
                }

                toast.current.show({
                    severity: 'success',
                    summary: 'Éxito',
                    detail: 'La solicitud ha sido agendada correctamente',
                    life: 3000
                });
            }

            onClose();
        } catch (error) {
            console.error('Error gestionando cita:', error);
            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: error?.data?.message || 'No se pudo gestionar la cita',
                life: 5000
            });
        }
    };

    return (
        <>
            <Toast ref={toast} />
            <Modal
                open={visible}
                title={isUpdate ? "Actualizar Cita" : "Crear Cita"}
                onCancel={onClose}
                footer={null}
                width={800}
                bodyStyle={{ padding: '20px', backgroundColor: '#f6f9fc' }}
            >
                {loading ? (
                    <Spin tip="Cargando..." />
                ) : (
                    <Form form={form} layout="vertical">
                        <Row gutter={[16, 16]}>
                            <Col span={8}>
                                <Form.Item label="Id Solicitud" name="id_solicitud">
                                    <Input disabled />
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Id Técnico" name="id_tecnico" rules={[{ required: true, message: 'Selecciona un técnico' }]}>
                                    <Select loading={!technicians.length}>
                                        {technicians.map(tech => (
                                            <Option key={tech.id_usuario} value={tech.id_usuario}>
                                                {tech.nombre} {tech.apellido}
                                            </Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={8}>
                                <Form.Item label="Fecha y Hora" name="datetime" rules={[{ required: true, message: 'Selecciona fecha y hora' }]}>
                                    <ConfigProvider locale={buddhistLocale}>
                                        <Space direction="vertical">
                                            <AntDatePicker
                                                showTime={{ format: 'HH:mm', minuteStep: 15 }}
                                                format="YYYY-MM-DD HH:mm"
                                                value={form.getFieldValue('datetime')}
                                                onChange={(date) => form.setFieldValue('datetime', date)}
                                            />
                                        </Space>
                                    </ConfigProvider>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Form.Item>
                            <Button type="primary" onClick={handleSubmit} loading={isCreating || isUpdating}>
                                {isUpdate ? "Actualizar" : "Enviar"}
                            </Button>
                        </Form.Item>
                    </Form>
                )}

                {/* Display Servicios */}
                {solicitudDetails?.servicios?.length > 0 && (
                    <>
                        <Title level={5}>Servicios Solicitados</Title>
                        {solicitudDetails.servicios.map((servicio, index) => (
                            <Card
                                key={index}
                                title={servicio.servicio_nombre}
                                bordered={true}
                                style={{ marginBottom: '15px', borderRadius: '8px' }}
                            >
                                <List
                                    dataSource={servicio.detalles || []}
                                    renderItem={(detalle) => (
                                        <List.Item style={{ justifyContent: 'start'}}>
                                            <CheckCircleOutlined style={{ color: 'green', marginRight: 30 }} />
                                            <Text>{detalle}</Text>
                                        </List.Item>
                                    )}
                                />
                            </Card>
                        ))}
                    </>
                )}
            </Modal>
        </>
    );
}
