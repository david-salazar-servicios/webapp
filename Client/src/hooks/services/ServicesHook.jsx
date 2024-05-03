import React from "react";
import { Card, Row, Col, Button, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useGetServiceByIdQuery } from "../../features/services/ServicesApiSlice";

const { Title, Text } = Typography;

export default function ServicesHook({ serviceId, onDelete }) {
    const { data: service, isLoading } = useGetServiceByIdQuery(serviceId);

    if (isLoading) return <Text>Loading...</Text>;

    return (
        <Card className="rounded-3 mb-4 shadow-sm">
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
                    }} icon={<DeleteOutlined />} type="link" className="text-danger shadow-sm" onClick={() => onDelete(serviceId)} />
                </Col>
            </Row>
        </Card>
    );
}
