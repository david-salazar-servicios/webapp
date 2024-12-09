import React, { useState } from "react";
import { Form, Input, Row, Col, Button, Select } from "antd";
import { Calendar } from "primereact/calendar";
import { useLocation } from "react-router-dom";
import { Tag } from "antd";
import { addLocale } from 'primereact/api';
const { Option } = Select;

addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar',
});

export default function FormularioSolicitud({
    form,
    onFinish,
    isSubmitting,
    onDatesCalculated = () => { },
}) {
    const [isEmailSending, setIsEmailSending] = useState(false);
    const [startDate, setStartDate] = useState(null); // Fecha inicial
    const [endDate, setEndDate] = useState(null); // Fecha final
    const [frequency, setFrequency] = useState(""); // Frecuencia seleccionada
    const [intervals, setIntervals] = useState(""); // Resultado del cálculo de intervalos
    const [calculatedDates, setCalculatedDates] = useState([]); // Fechas calculadas
    const location = useLocation();

    // Check if the URL contains "mantenimiento"
    const isMantenimiento = location.pathname.includes("mantenimiento");

    const handleFrequencyChange = (value) => {
        setFrequency(value);
        calculateIntervals(startDate, endDate, value);
    };

    const calculateIntervals = (start, end, freq) => {
        if (!start || !freq) {
            setIntervals("");
            setCalculatedDates([]);
            onDatesCalculated([]); // Enviar lista vacía al padre
            return;
        }

        const startDate = new Date(start);
        let endDate = end ? new Date(end) : null;


        if (endDate && endDate <= startDate) {
            setIntervals(
                <Tag color="red">La fecha final debe ser posterior a la fecha inicial.</Tag>
            );
            setCalculatedDates([]);
            onDatesCalculated([]); // Enviar lista vacía al padre
            return;
        }


        let frequencyLabel = "";
        let occurrences = 0;
        let dates = [];
        let tempDate = new Date(startDate);

        switch (freq) {
            case "cada_mes":
                frequencyLabel = "Mensual";
                while (!endDate || tempDate <= endDate) {
                    dates.push(tempDate.toISOString());
                    tempDate.setMonth(tempDate.getMonth() + 1);
                    occurrences++;
                    if (occurrences > 100) break; // Evitar bucles infinitos
                }
                break;
            case "trimestre":
                frequencyLabel = "Trimestral";
                while (!endDate || tempDate <= endDate) {
                    dates.push(tempDate.toISOString());
                    tempDate.setMonth(tempDate.getMonth() + 3);
                    occurrences++;
                    if (occurrences > 100) break;
                }
                break;
            case "seis_meses":
                frequencyLabel = "Semestral";
                while (!endDate || tempDate <= endDate) {
                    dates.push(tempDate.toISOString());
                    tempDate.setMonth(tempDate.getMonth() + 6);
                    occurrences++;
                    if (occurrences > 100) break;
                }
                break;
            case "anual":
                frequencyLabel = "Anual";
                while (!endDate || tempDate <= endDate) {
                    dates.push(tempDate.toISOString());
                    tempDate.setFullYear(tempDate.getFullYear() + 1);
                    occurrences++;
                    if (occurrences > 100) break;
                }
                break;
            case "sin_frecuencia":
            default:
                frequencyLabel = "Sin Frecuencia";
                dates = [startDate.toISOString()];
        }

        setIntervals(
            <Tag color="blue">
              {`${frequencyLabel} (${occurrences} ocurrencias)`}
            </Tag>
        );
        setCalculatedDates(dates);
        onDatesCalculated(dates); // Enviar fechas calculadas
    };

    const handleFinish = async (values) => {
        if (!startDate) {
            // Mostrar error si no hay fecha inicial
            form.setFields([
                {
                    name: "fecha_preferencia",
                    errors: ["Por favor seleccione una fecha inicial o preferencia"],
                },
            ]);
            return;
        }

        const fechasFrecuencia = calculatedDates.length > 0 ? calculatedDates : [startDate.toISOString()];
        onFinish({ ...values, fechasFrecuencia });
    };



    const handleReset = () => {
        form.resetFields(); // Resetea todos los campos del formulario
        setStartDate(null);
        setEndDate(null);
        setFrequency("");
        setIntervals("");
        setCalculatedDates([]);
    };

    return (
        <Form
            form={form}
            name="requestForm"
            layout="vertical"
            onFinish={handleFinish}
            autoComplete="off"
        >
            <Row gutter={24}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="nombre"
                        label="Nombre"
                        rules={[{ required: true, message: "Por favor ingrese su nombre" }]}
                    >
                        <Input placeholder="Ingrese su nombre" />
                    </Form.Item>
                    <Form.Item
                        name="apellido"
                        label="Apellido"
                        rules={[{ required: true, message: "Por favor ingrese su apellido" }]}
                    >
                        <Input placeholder="Ingrese su apellido" />
                    </Form.Item>
                    <Form.Item
                        name="direccion"
                        label="Dirección"
                        rules={[{ required: true, message: "Por favor ingrese su dirección completa" }]}
                    >
                        <Input placeholder="Provincia/Cantón/Distrito, Otro detalle" />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="correo_electronico"
                        label="Correo Electrónico"
                        rules={[
                            {
                                required: true,
                                message: "Por favor ingrese su correo electrónico",
                                type: "email",
                            },
                        ]}
                    >
                        <Input placeholder="Ingrese su correo electrónico" />
                    </Form.Item>
                    <Form.Item
                        name="telefono"
                        label="Teléfono Móvil"
                        rules={[
                            { required: true, message: "Por favor ingrese su número de teléfono móvil" },
                        ]}
                    >
                        <Input placeholder="Ingrese su número de teléfono" />
                    </Form.Item>
                    <Form.Item
                        name="telefono_fijo"
                        label="Teléfono Fijo (Casa/Empresa)"
                        rules={[
                            { required: true, message: "Por favor ingrese su número de teléfono fijo" },
                        ]}
                    >
                        <Input placeholder="Ingrese su número de teléfono fijo" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col xs={24} sm={12}>
                    <Form.Item
                        name="fecha_preferencia"
                        label="Fecha Preferencia"
                        rules={[{ required: true, message: "Por favor seleccione una fecha inicial o preferencia" }]}
                    >
                        <Calendar
                            showTime
                            hourFormat="12"
                            stepMinute={15}
                            style={{ height: "32px" }}
                            value={startDate}
                            locale="es" // Configura el idioma a español
                            onChange={(e) => {
                                setStartDate(e.value);
                                calculateIntervals(e.value, endDate, frequency);
                            }}
                        />
                    </Form.Item>
                </Col>
                {isMantenimiento && (
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="fecha_final"
                            label="Fecha Final"
                        >
                            <Calendar
                                showTime
                                hourFormat="12"
                                stepMinute={15}
                                style={{ height: "32px" }}
                                value={endDate}
                                locale="es" // Configura el idioma a español
                                onChange={(e) => {
                                    setEndDate(e.value);
                                    calculateIntervals(startDate, e.value, frequency);
                                }}
                            />
                        </Form.Item>
                    </Col>
                )}
            </Row>
            {isMantenimiento && (
                <Row gutter={24}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                            name="frecuencia"
                            label="Frecuencia"
                            rules={[{ required: true, message: "Por favor seleccione una frecuencia" }]}
                        >
                            <Select
                                placeholder="Seleccione una frecuencia"
                                value={frequency}
                                onChange={handleFrequencyChange}
                            >
                                <Option value="sin_frecuencia">Sin Frecuencia</Option>
                                <Option value="cada_mes">Cada Mes</Option>
                                <Option value="trimestre">Trimestre</Option>
                                <Option value="seis_meses">Cada 6 Meses</Option>
                                <Option value="anual">Anual</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    <Form.Item label="Cálculo de Fechas">
                        <span>
                            {intervals || "Seleccione las fechas y la frecuencia para calcular."}
                        </span>
                    </Form.Item>
                </Row>
            )}
            <Row>
                <Col span={24}>
                    <Form.Item name="observacion" label="Observación">
                        <Input.TextArea rows={4} placeholder="Ingrese cualquier observación relevante" />
                    </Form.Item>
                </Col>
            </Row>
            <Row justify="end">
                <Col>
                    <Button onClick={handleReset}>Resetear</Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        style={{ marginLeft: 8 }}
                        loading={isSubmitting || isEmailSending}
                    >
                        {isSubmitting || isEmailSending ? "Enviando..." : "Enviar"}
                    </Button>
                </Col>
            </Row>
        </Form>
    );
}