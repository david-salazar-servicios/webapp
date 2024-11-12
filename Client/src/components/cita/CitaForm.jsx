import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Input, ConfigProvider, Select, Button, Space, Spin, Row, Col, Card, Typography, List } from 'antd';
import { DatePicker as AntDatePicker } from 'antd';
import { useGetUsersQuery } from '../../features/users/UsersApiSlice';
import { useGetUsersRolesQuery, useGetRolesQuery } from '../../features/roles/RolesApiSlice';
import { useCreateCitaMutation, useUpdateCitaMutation, useGetAllCitasQuery, useUpdateCitaEstadoMutation } from '../../features/cita/CitaApiSlice';
import { useUpdateSolicitudEstadoMutation, useGetSolicitudByIdQuery, useUpdateSolicitudFechaPreferenciaMutation } from '../../features/RequestService/RequestServiceApiSlice';
import { useSendGenericEmailMutation } from '../../features/contacto/sendGenericEmailApiSlice';
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
    const [updateCitaEstado] = useUpdateCitaEstadoMutation();
    const [form] = Form.useForm();
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null);
    const [sendGenericEmail] = useSendGenericEmailMutation();
    const { data: users } = useGetUsersQuery();
    const { data: rolesData } = useGetRolesQuery();
    const { data: userRolesData, refetch: refetchUserRoles } = useGetUsersRolesQuery();
    const { data: citaData } = useGetAllCitasQuery();
    const [isEmailSending, setIsEmailSending] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { data: solicitudDetails, isLoading: isSolicitudLoading, refetch } = useGetSolicitudByIdQuery(solicitudData?.id_solicitud, {
        skip: !solicitudData?.id_solicitud
    });
    const [isSubmitLoading, setIsSubmitLoading] = useState(false);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);
    const [isRejectLoading, setIsRejectLoading] = useState(false);

    const [createCita, { isLoading: isCreating }] = useCreateCitaMutation();
    const [updateCita, { isLoading: isUpdating }] = useUpdateCitaMutation();
    const [updateSolicitudEstado] = useUpdateSolicitudEstadoMutation();
    const [updateSolicitudFechaPreferencia] = useUpdateSolicitudFechaPreferenciaMutation();

    // Define filteredCita in the outer scope
    const filteredCita = citaData?.find(cita => cita.id_solicitud === solicitudData?.id_solicitud);

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

            form.resetFields();
            form.setFieldsValue({
                id_solicitud: solicitudDetails.id_solicitud,
                id_tecnico: filteredCita ? filteredCita.id_tecnico : '',
                datetime: filteredCita ? dayjs(filteredCita.datetime) : preferredDate,
            });
        }
    }, [solicitudDetails, form, solicitudData, visible, isSolicitudLoading, citaData]);

    const handleSubmit = async () => {
        setIsSubmitting(true); // Start submission process for the Submit button
        setIsEmailSending(false); // Reset email sending state at the beginning

        try {
            const values = await form.validateFields();
            const formattedDateTime = values.datetime ? dayjs(values.datetime).format('YYYY-MM-DDTHH:mm:ssZ') : null;

            if (isUpdate && filteredCita) {
                await updateCita({ ...values, id_cita: filteredCita.id_cita, datetime: formattedDateTime, estado: 'En Agenda' }).unwrap();

                if (formattedDateTime) {
                    await updateSolicitudFechaPreferencia({ id: values.id_solicitud, fecha_preferencia: formattedDateTime }).unwrap();
                }

                // Start email sending process for updating solicitud
                setIsEmailSending(true);
                await sendGenericEmail({
                    nombre: solicitudData.nombre,
                    correo: solicitudData.correo_electronico,
                    mensaje: `La solicitud con ID ${solicitudData.id_solicitud} ha sido actualizada con una nueva fecha ${dayjs(values.datetime).format('YYYY-MM-DD HH:mm')} y estado En Agenda.`,
                    telefono: `${solicitudData.telefono}${solicitudData.telefono_fijo ? ' / ' + solicitudData.telefono_fijo : ''}`,
                    type: "ActualizarSolicitud"
                }).unwrap();
                setIsEmailSending(false); // End email sending process

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

                // Start email sending process for creating cita
                setIsEmailSending(true);
                await sendGenericEmail({
                    nombre: solicitudData.nombre,
                    correo: solicitudData.correo_electronico,
                    mensaje: `Se ha creado una nueva cita para la solicitud con ID ${solicitudData.id_solicitud} programada para la fecha ${dayjs(values.datetime).format('YYYY-MM-DD HH:mm')}.`,
                    telefono: `${solicitudData.telefono}${solicitudData.telefono_fijo ? ' / ' + solicitudData.telefono_fijo : ''}`,
                    type: "CrearCita"
                }).unwrap();
                setIsEmailSending(false); // End email sending process

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
        } finally {
            setIsSubmitting(false); // End submission process
            setIsEmailSending(false); // Ensure email sending is reset
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
                style={{ padding: '20px', backgroundColor: '#f6f9fc' }}
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
                            <Space>
                                {/* Submit Button */}
                                <Button
                                    type="primary"
                                    onClick={async () => {
                                        setIsSubmitLoading(true);   // Start loading for Submit button
                                        setIsConfirmLoading(false); // Ensure Confirm button isn't loading
                                        setIsRejectLoading(false);  // Ensure Reject button isn't loading
                                        await handleSubmit();
                                        setIsSubmitLoading(false);  // Stop loading after submission
                                    }}
                                    loading={isSubmitLoading}  // Spinner only for Submit button
                                    style={{
                                        backgroundColor: isSubmitLoading || isConfirmLoading || isRejectLoading ? '#1890ff' : '', // Ensure button color remains blue
                                        color: 'white',
                                        borderColor: '#1890ff'
                                    }}
                                    disabled={isSubmitLoading || isConfirmLoading || isRejectLoading} // Disable other buttons when one is loading
                                >
                                    {isSubmitLoading ? "Procesando..." : isUpdate ? "Actualizar" : "Enviar"}
                                </Button>

                                {/* Confirm Button (only visible if isUpdate and filteredCita are true) */}
                                {isUpdate && filteredCita && (
                                    <Button
                                        type="default"
                                        style={{
                                            backgroundColor: isConfirmLoading ? '#22c55e' : '#22c55e',
                                            color: 'white',
                                            borderColor: '#22c55e'
                                        }}
                                        onClick={async () => {
                                            setIsConfirmLoading(true); // Start loading for Confirm button
                                            setIsSubmitLoading(false); // Ensure Submit button isn't loading
                                            setIsRejectLoading(false); // Ensure Reject button isn't loading
                                            try {
                                                await updateSolicitudEstado({ id: solicitudData.id_solicitud, estado: 'Confirmada' }).unwrap();
                                                await updateCitaEstado({ id: filteredCita.id_cita, estado: 'Confirmada' }).unwrap();

                                                // Send confirmation email
                                                setIsEmailSending(true);
                                                await sendGenericEmail({
                                                    nombre: solicitudData.nombre,
                                                    correo: solicitudData.correo_electronico,
                                                    mensaje: `La solicitud con ID ${solicitudData.id_solicitud} ha sido confirmada junto con la cita.`,
                                                    telefono: `${solicitudData.telefono}${solicitudData.telefono_fijo ? ' / ' + solicitudData.telefono_fijo : ''}`,
                                                    type: "ConfirmarSolicitud"
                                                }).unwrap();

                                                toast.current.show({
                                                    severity: 'success',
                                                    summary: 'Confirmada',
                                                    detail: 'La solicitud y cita han sido confirmadas',
                                                    life: 3000
                                                });
                                                onClose();
                                            } catch (error) {
                                                toast.current.show({
                                                    severity: 'error',
                                                    summary: 'Error',
                                                    detail: 'Error al confirmar la solicitud y cita',
                                                    life: 5000
                                                });
                                            } finally {
                                                setIsConfirmLoading(false);
                                                setIsEmailSending(false);
                                            }
                                        }}
                                        loading={isConfirmLoading}  // Spinner only for Confirm button
                                        disabled={isSubmitLoading || isConfirmLoading || isRejectLoading} // Disable other buttons when one is loading
                                    >
                                        Confirmar
                                    </Button>
                                )}

                                {/* Reject Button */}
                                <Button
                                    type="primary"
                                    danger
                                    onClick={async () => {
                                        setIsRejectLoading(true);   // Start loading for Reject button
                                        setIsSubmitLoading(false);  // Ensure Submit button isn't loading
                                        setIsConfirmLoading(false); // Ensure Confirm button isn't loading
                                        try {
                                            await updateSolicitudEstado({ id: solicitudData.id_solicitud, estado: 'Rechazada' }).unwrap();

                                            // Send rejection email
                                            setIsEmailSending(true);
                                            await sendGenericEmail({
                                                nombre: solicitudData.nombre,
                                                correo: solicitudData.correo_electronico,
                                                mensaje: `La solicitud con ID ${solicitudData.id_solicitud} ha sido rechazada.`,
                                                telefono: `${solicitudData.telefono}${solicitudData.telefono_fijo ? ' / ' + solicitudData.telefono_fijo : ''}`,
                                                type: "RechazarSolicitud"
                                            }).unwrap();

                                            toast.current.show({
                                                severity: 'success',
                                                summary: 'Rechazada',
                                                detail: 'La solicitud ha sido rechazada',
                                                life: 3000
                                            });
                                            onClose();
                                        } catch (error) {
                                            toast.current.show({
                                                severity: 'error',
                                                summary: 'Error',
                                                detail: 'Error al rechazar la solicitud',
                                                life: 5000
                                            });
                                        } finally {
                                            setIsRejectLoading(false);
                                            setIsEmailSending(false);
                                        }
                                    }}
                                    loading={isRejectLoading}  // Spinner only for Reject button
                                    style={{
                                        backgroundColor: isRejectLoading ? '#ff4d4f' : '#ff4d4f', // Ensure button color remains red
                                        color: 'white',
                                        borderColor: '#ff4d4f'
                                    }}
                                    disabled={isSubmitLoading || isConfirmLoading || isRejectLoading} // Disable other buttons when one is loading
                                >
                                    Rechazar
                                </Button>
                            </Space>
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
                                        <List.Item style={{ justifyContent: 'start' }}>
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

