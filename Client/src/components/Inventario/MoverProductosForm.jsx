import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, Button, Radio, Select, Row, Col, Tooltip, Modal } from 'antd';
import { Toast } from 'primereact/toast';
import { useUpdateCantidadInventarioProductoMutation } from '../../features/Inventario/InventarioApiSlice';
import BitacoraMovimientosTable from './GestionInventarioBitacoraTable';
const { Option } = Select;

const MoverProductosForm = ({
  selectedProduct,
  inventarios,
  selectedBodega,
  handleInputChange,
  onClearSelection,
}) => {
  const toast = useRef(null); // Add toast ref
  const [updateCantidadInventarioProducto] = useUpdateCantidadInventarioProductoMutation();
  const [action, setAction] = useState('agregar');
  const [cantidad, setCantidad] = useState(0.00);
  const [destinoInventario, setDestinoInventario] = useState(null);
  const [isDialogVisible, setIsDialogVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const openDialog = () => {
    setIsDialogVisible(true);
  };

  const closeDialog = () => {
    setIsDialogVisible(false);
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };
  const filteredInventarios = inventarios.filter(
    (inv) => inv.id_inventario !== selectedBodega?.id_inventario
  );

  useEffect(() => {
    setCantidad(0);
    setDestinoInventario(null);
  }, [selectedBodega]);

  const handleCantidadChange = (e) => {
    const value = e.target.value;
    if (/^\d*(\.\d{0,2})?$/.test(value)) {
      setCantidad(value);
      if (handleInputChange) {
        handleInputChange(selectedProduct?.id_producto, parseFloat(value) || 0);
      }
    }
  };

  const handleConfirm = async () => {
    if (!action) {
      console.error("Action is required.");
      return;
    }

    const payload = {
      id_inventario: selectedBodega?.id_inventario,
      id_producto: selectedProduct?.id_producto,
      cantidad,
      action,
      destino_inventario: action === 'mover' ? destinoInventario : null,
    };

    try {
      const result = await updateCantidadInventarioProducto(payload).unwrap();
      toast.current.show({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Actualización realizada con éxito.',
        life: 3000,
      });

      setCantidad(0);
      setDestinoInventario(null);
      if (onClearSelection) {
        onClearSelection();
      }
    } catch (error) {
      if (error.status === 400) {
        toast.current.show({
          severity: 'warn',
          summary: 'Advertencia',
          detail: error.data.message || 'Solicitud incorrecta.',
          life: 3000,
        });
      } else if (error.status === 404) {
        toast.current.show({
          severity: 'warn',
          summary: 'Advertencia',
          detail: error.data.message || 'Recurso no encontrado.',
          life: 3000,
        });
      } else if (error.status === 500) {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error interno del servidor. Intente nuevamente más tarde.',
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Error inesperado. Por favor, revise la consola para más detalles.',
          life: 3000,
        });
      }
      console.error("Failed to update:", error);
    }
  };

  const isConfirmDisabled =
    !cantidad ||
    !selectedProduct ||
    (action === 'mover' && !destinoInventario);

  const tooltipMessage = (() => {
    if (!cantidad) {
      return action === 'mover' ? 'Ingrese una cantidad y seleccione un inventario destino' : 'Ingrese una cantidad';
    }
    if (!selectedProduct) {
      return 'Seleccione un producto';
    }
    if (action === 'mover' && !destinoInventario) {
      return 'Seleccione un inventario destino';
    }
    return '';
  })();

  return (
    <Form layout="vertical">
      <Toast ref={toast} /> {/* Toast Component */}

      <Radio.Group
        value={action}
        onChange={(e) => setAction(e.target.value)}
        buttonStyle="solid"
        style={{ marginBottom: 16 }}
      >
        <Radio.Button value="agregar">Agregar</Radio.Button>
        <Radio.Button value="eliminar">Eliminar</Radio.Button>
        <Radio.Button value="mover">Mover</Radio.Button>
      </Radio.Group>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Nombre del Producto">
            <Input value={selectedProduct?.nombre_producto || ''} readOnly />
          </Form.Item>
        </Col>

        <Col span={12}>
          <Form.Item label="Unidad de Medida">
            <Input value={selectedProduct?.unidad_medida || 'N/A'} readOnly />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item label="Cantidad">
            <Input
              value={cantidad}
              onChange={handleCantidadChange}
              placeholder="Ingrese la cantidad"
            />
          </Form.Item>
        </Col>

        <Col span={12}>
          {action === 'mover' && (
            <Form.Item label="Mover a Inventario">
              <Select
                placeholder="Inventario destino"
                onChange={setDestinoInventario}
                value={destinoInventario}
              >
                {filteredInventarios.map((inv) => (
                  <Option key={inv.id_inventario} value={inv.id_inventario}>
                    {inv.nombre_inventario}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
        </Col>
      </Row>

      <Form.Item style={{ textAlign: 'left', marginTop: 16 }}>
        <Tooltip title={tooltipMessage}>
          <Button
            type="primary"
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
          >
            Confirmar
          </Button>
        </Tooltip>
        <Button type="primary" onClick={openModal} style={{ marginLeft: '10px' }}>
            Ver Movimientos de Inventario
          </Button>
          <Modal
            visible={isModalVisible}
            onCancel={closeModal}
            footer={null}
            width="80vw"
          >
            <BitacoraMovimientosTable />
          </Modal>
      </Form.Item>
    </Form>
  );
};

export default MoverProductosForm;
