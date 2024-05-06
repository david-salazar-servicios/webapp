import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Input, ConfigProvider, Select, Button, Space, Spin } from 'antd';
import { DatePicker as AntDatePicker } from 'antd';
import { useGetUsersQuery } from '../../features/users/UsersApiSlice';
import { useGetUsersRolesQuery, useGetRolesQuery } from '../../features/roles/RolesApiSlice';
import { useCreateCitaMutation } from '../../features/cita/CitaApiSlice';
import { useUpdateSolicitudEstadoMutation, useGetSolicitudByIdQuery } from '../../features/RequestService/RequestServiceApiSlice';
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import utc from 'dayjs/plugin/utc';
import enUS from 'antd/es/locale/en_US';
import { Toast } from 'primereact/toast'; // Import PrimeReact Toast

const { Option } = Select;

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

export default function CitaForm({ visible, onClose, citaData }) {
    const [form] = Form.useForm();
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null); // Create a Toast reference

    // Fetch users, roles, and user roles only once
    const { data: users } = useGetUsersQuery();
    const { data: rolesData } = useGetRolesQuery();
    const { data: userRolesData, isError: isUserRolesError, refetch: refetchUserRoles } = useGetUsersRolesQuery();
    // Fetch solicitud details only if citaData is available
    const { data: solicitudDetails, isLoading: isSolicitudLoading, refetch } = useGetSolicitudByIdQuery(citaData?.id_solicitud, {
        skip: !citaData?.id_solicitud // Skip fetch if no citaData is provided
    });

    const [createCita, { isLoading: isCreating }] = useCreateCitaMutation();
    const [updateSolicitudEstado] = useUpdateSolicitudEstadoMutation();

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
        }, 500); // Adjust the interval if necessary
        return () => clearInterval(interval);
    }, [refetchUserRoles]);

    useEffect(() => {
        if (visible && citaData) {
            setLoading(true);
            refetch(); // Refetch the data
        }
    }, [visible, citaData, refetch]);

    // Update form fields only when the form is visible and citaData changes
    useEffect(() => {
        if (visible && citaData && solicitudDetails && !isSolicitudLoading) {
            setLoading(false); // Stop loading when the data is fetched
            const preferredDate = solicitudDetails.fecha_preferencia ? dayjs(solicitudDetails.fecha_preferencia) : null;
            form.resetFields();
            form.setFieldsValue({
                id_solicitud: solicitudDetails.id_solicitud,
                id_tecnico: '',
                datetime: preferredDate,
            });
        }
    }, [solicitudDetails, form, citaData, visible, isSolicitudLoading]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            await createCita(values).unwrap();
            await updateSolicitudEstado({ id: values.id_solicitud, estado: 'En Agenda' }).unwrap();
            onClose();
        } catch (error) {
            console.error('Error creando cita:', error);

            if (error.status === 409) {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Ya existe una cita para esta fecha y hora con este técnico',
                    life: 5000
                });
            } else {
                toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'No se pudo crear la cita',
                    life: 5000
                });
            }
        }
    };

    return (
        <>
            <Toast ref={toast} /> {/* Add the Toast component */}
            <Modal open={visible} title="Crear Cita" onCancel={onClose} footer={null}>
                {loading ? (
                    <Spin tip="Cargando..." />
                ) : (
                    <Form form={form} layout="vertical">
                        <Form.Item label="Id Solicitud" name="id_solicitud">
                            <Input disabled />
                        </Form.Item>
                        <Form.Item label="Id Técnico" name="id_tecnico" rules={[{ required: true, message: 'Selecciona un técnico' }]}>
                            <Select loading={!technicians.length}>
                                {technicians.map(tech => (
                                    <Option key={tech.id_usuario} value={tech.id_usuario}>
                                        {tech.nombre} {tech.apellido}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="Fecha y Hora" name="datetime">
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
                        <Form.Item>
                            <Button type="primary" onClick={handleSubmit} loading={isCreating}>Enviar</Button>
                        </Form.Item>
                    </Form>
                )}

                {/* Show details */}
                {solicitudDetails && (
                    <div>
                        <h3>Servicios</h3>
                        {solicitudDetails.detalles && solicitudDetails.detalles.map(servicio => (
                            <div key={servicio.id_detalle_solicitud}>
                                <p><strong>{servicio.servicio_nombre}</strong>: {servicio.servicio_descripcion}</p>
                            </div>
                        ))}
                    </div>
                )}
            </Modal>
        </>
    );
}
