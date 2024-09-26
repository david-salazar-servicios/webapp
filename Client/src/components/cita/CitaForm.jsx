import React, { useEffect, useState, useRef } from 'react';
import { Modal, Form, Input, ConfigProvider, Select, Button, Space, Spin } from 'antd';
import { DatePicker as AntDatePicker } from 'antd';
import { useGetUsersQuery } from '../../features/users/UsersApiSlice';
import { useGetUsersRolesQuery, useGetRolesQuery } from '../../features/roles/RolesApiSlice';
import { useCreateCitaMutation, useUpdateCitaMutation, useGetAllCitasQuery } from '../../features/cita/CitaApiSlice';
import { useUpdateSolicitudEstadoMutation, useGetSolicitudByIdQuery, useUpdateSolicitudFechaPreferenciaMutation } from '../../features/RequestService/RequestServiceApiSlice'; // Import the mutation for updating fecha_preferencia
import dayjs from 'dayjs';
import buddhistEra from 'dayjs/plugin/buddhistEra';
import utc from 'dayjs/plugin/utc';
import enUS from 'antd/es/locale/en_US';
import { Toast } from 'primereact/toast';

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

export default function CitaForm({ visible, onClose, solicitudData, isUpdate }) {
    const [form] = Form.useForm();
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    const toast = useRef(null); // Create a Toast reference

    // Fetch users, roles, and user roles
    const { data: users } = useGetUsersQuery();
    const { data: rolesData } = useGetRolesQuery();
    const { data: userRolesData, refetch: refetchUserRoles } = useGetUsersRolesQuery();
    const { data: citaData } = useGetAllCitasQuery();

    // Fetch solicitud details only if solicitudData is available
    const { data: solicitudDetails, isLoading: isSolicitudLoading, refetch } = useGetSolicitudByIdQuery(solicitudData?.id_solicitud, {
        skip: !solicitudData?.id_solicitud // Skip fetch if no solicitudData is provided
    });

    const [createCita, { isLoading: isCreating }] = useCreateCitaMutation();
    const [updateCita, { isLoading: isUpdating }] = useUpdateCitaMutation(); // Mutation for updating an existing Cita
    const [updateSolicitudEstado] = useUpdateSolicitudEstadoMutation();
    const [updateSolicitudFechaPreferencia] = useUpdateSolicitudFechaPreferenciaMutation(); // Add the hook for updating fecha_preferencia

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
        if (visible && solicitudData) {
            setLoading(true);
            refetch(); // Refetch the data
        }
    }, [visible, solicitudData, refetch]);

    useEffect(() => {
        if (visible && solicitudData && solicitudDetails && !isSolicitudLoading) {
            setLoading(false); // Stop loading when the data is fetched
    
            const preferredDate = solicitudDetails.fecha_preferencia ? dayjs(solicitudDetails.fecha_preferencia) : null;
    
            // Find cita by id_solicitud, it may not exist if creating a new cita
            const filteredCita = citaData?.find(cita => cita.id_solicitud === solicitudDetails.id_solicitud);
    
            // Reset form fields and set values, using defaults if filteredCita is not found
            form.resetFields();
            form.setFieldsValue({
                id_solicitud: solicitudDetails.id_solicitud,
                id_tecnico: filteredCita ? filteredCita.id_tecnico : '', // If filteredCita is not found, set id_tecnico to an empty string
                datetime: filteredCita ? dayjs(filteredCita.datetime) : preferredDate, // Use filteredCita's datetime or default to preferred date
            });
        }
    }, [solicitudDetails, form, solicitudData, visible, isSolicitudLoading, citaData]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
    
            // Find the filteredCita by id_solicitud (just like in the useEffect)
            const filteredCita = citaData.find(cita => cita.id_solicitud === solicitudData.id_solicitud);
    
            // Format the selected datetime to the desired format for both Cita and Solicitud using dayjs
            const formattedDateTime = values.datetime ? dayjs(values.datetime).format('YYYY-MM-DDTHH:mm:ssZ') : null;
    
            if (isUpdate && filteredCita) {
                console.log("Cita Data", filteredCita);
                console.log("Form values", values);
    
                // Update Cita with the formatted date
                await updateCita({ ...values, id_cita: filteredCita.id_cita, datetime: formattedDateTime, estado: 'En Agenda' }).unwrap();
                
                // Update fecha_preferencia of solicitud with the same formatted date
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
                // If creating a new cita
                await createCita({ ...values, datetime: formattedDateTime }).unwrap();
                await updateSolicitudEstado({ id: values.id_solicitud, estado: 'En Agenda' }).unwrap();
    
                // Update fecha_preferencia of solicitud with the same formatted date
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
    
            // Close the modal after success
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
            <Toast ref={toast} /> {/* Add the Toast component */}
            <Modal
                open={visible}
                title={isUpdate ? "Actualizar Cita" : "Crear Cita"} // Change title based on isUpdate
                onCancel={onClose}
                footer={null}
            >
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
                        <Form.Item>
                            <Button type="primary" onClick={handleSubmit} loading={isCreating || isUpdating}>
                                {isUpdate ? "Actualizar" : "Enviar"}
                            </Button>
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
