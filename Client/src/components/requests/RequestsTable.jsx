import React from 'react';
import { useGetSolicitudesQuery } from '../../features/RequestService/RequestServiceApiSlice';
import { Table, Spin, Alert } from 'antd';

export default function SolicitudesTable() {
  const {
    data: solicitudes,
    isLoading,
    isError,
    error
  } = useGetSolicitudesQuery();

  const columns = [
    {
      title: 'Id Solicitud',
      dataIndex: 'id_solicitud',
      key: 'id_solicitud',
    },
    {
      title: 'Fecha de Creación',
      dataIndex: 'fecha_creacion',
      key: 'fecha_creacion',
      // you can use render method to format the date
      render: text => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
    },
    {
      title: 'ID Usuario',
      dataIndex: 'id_usuario',
      key: 'id_usuario',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
    },
    {
      title: 'Correo Electrónico',
      dataIndex: 'correo_electronico',
      key: 'correo_electronico',
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
    },
    {
      title: 'Observación',
      dataIndex: 'observacion',
      key: 'observacion',
    },
    // Add more columns for additional actions or information
  ];

  if (isLoading) {
    return <Spin size="large" />;
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description={error?.data?.error || 'Hubo un error al obtener las solicitudes'}
        type="error"
      />
    );
  }

  return (
    <Table
      columns={columns}
      dataSource={solicitudes}
      rowKey="id" // Assume each solicitud has a unique 'id'
      pagination={{ pageSize: 10}} // Optionally, control the page size
      style={{ marginTop: '20px', height:"100%", width:"100%" }}
    />
  );
}
