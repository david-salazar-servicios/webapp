import React, { useState } from 'react';
import { Form, Input, Button, Radio, Select, Row, Col, Tooltip } from 'antd';
import { InputNumber } from 'primereact/inputnumber'; // PrimeReact InputNumber

const { Option } = Select;

const MoverProductosForm = ({
  selectedProduct,
  inventarios,
  selectedBodega,
  handleMoveProduct,
  handleInputChange,
}) => {
  const [action, setAction] = useState('agregar'); // Manage selected action
  const [cantidad, setCantidad] = useState(0); // State for InputNumber

  const filteredInventarios = inventarios.filter(
    (inv) => inv.nombre_inventario !== selectedBodega
  );

  const handleCantidadChange = (e) => {
    setCantidad(e.value); // PrimeReact's InputNumber passes event with value
    handleInputChange(selectedProduct?.id, e.value); // Notify parent about the input change
  };

  const isConfirmDisabled = !cantidad || cantidad <= 0; // Disable button if invalid

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
            <Input 
              value={selectedProduct?.unidad_medida || 'N/A'} 
              readOnly 
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item label="Cantidad">
        <InputNumber
          value={cantidad}
          onValueChange={handleCantidadChange}
          mode="decimal"
          showButtons
          min={0}
          placeholder="Ingrese la cantidad"
          style={{ width: '50%' }}
          className="custom-input-number"
        />
      </Form.Item>

      {action === 'mover' && (
        <Form.Item label="Mover a Inventario">
          <Select
            placeholder="Selecciona el inventario destino"
            onChange={handleMoveProduct}
          >
            {filteredInventarios.map((inv) => (
              <Option key={inv.id} value={inv.nombre_inventario}>
                {inv.nombre_inventario}
              </Option>
            ))}
          </Select>
        </Form.Item>
      )}

      <Form.Item style={{ textAlign: 'right', marginTop: 16 }}>
        <Tooltip
          title={
            isConfirmDisabled
              ? 'Ingrese una cantidad válida para continuar'
              : ''
          }
        >
          <Button
            type="primary"
            disabled={isConfirmDisabled}
            onClick={() =>
              handleMoveProduct(
                action === 'mover' ? 'Mover' : 'Acción Realizada'
              )
            }
          >
            Confirmar
          </Button>
        </Tooltip>
      </Form.Item>
    </Form>
  );
};

export default MoverProductosForm;
