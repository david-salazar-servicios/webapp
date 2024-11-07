import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Radio, Select, Row, Col, Tooltip } from 'antd';
import { useUpdateCantidadInventarioProductoMutation } from '../../features/Inventario/InventarioApiSlice';

const { Option } = Select;

const MoverProductosForm = ({
  selectedProduct,
  inventarios,
  selectedBodega,
  handleInputChange,
  onClearSelection, // New prop to notify parent to clear selection
}) => {
  const [updateCantidadInventarioProducto] = useUpdateCantidadInventarioProductoMutation();
  const [action, setAction] = useState('agregar');
  const [cantidad, setCantidad] = useState(0.00);
  const [destinoInventario, setDestinoInventario] = useState(null);

  const filteredInventarios = inventarios.filter(
    (inv) => inv.id_inventario !== selectedBodega?.id_inventario
  );

  useEffect(() => {
    setCantidad(0);
    setDestinoInventario(null); // Clear destination inventory when selectedBodega changes
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
      console.log("Update Successful:", result);

      // Clear form fields upon successful update
      setCantidad(0);
      setDestinoInventario(null);
      if (onClearSelection) {
        onClearSelection(); // Notify parent to clear selected product
      }
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const isConfirmDisabled = cantidad <= 0 || (action === 'mover' && (!cantidad || !destinoInventario));

  return (
    <Form layout="vertical">
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
        <Tooltip
          title={
            isConfirmDisabled
              ? 'Ingrese una cantidad válida y seleccione un inventario destino para continuar'
              : ''
          }
        >
          <Button
            type="primary"
            disabled={isConfirmDisabled}
            onClick={handleConfirm}
          >
            Confirmar
          </Button>
        </Tooltip>
      </Form.Item>
    </Form>
  );
};

export default MoverProductosForm;
