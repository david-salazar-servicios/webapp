import React from 'react';
import { Form, Input, Button, Card, Row, Col, Typography, message } from 'antd';
import { motion } from 'framer-motion';
import '../../vendor/bootstrap/css/contacto.css';
import WhyUs from '../../components/WhyUs';
import { useSendEmailContactoMutation } from '../../features/contacto/sendEmailContactoApiSlice';

const Contactenos = () => {
  const [form] = Form.useForm();
  const [sendEmailContacto, { isLoading }] = useSendEmailContactoMutation();

  // Define the animation variants
  const boxVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  const onFinish = async (values) => {
    try {
      await sendEmailContacto(values).unwrap();
      message.success('Correo enviado exitosamente');
      form.resetFields();
    } catch (error) {
      message.error('Error al enviar el correo');
    }
  };

  return (
    <>
      {/* Contact Start */}
      <div className="container-fluid py-5 wow fadeInUp" data-wow-delay="0.1s">
        <div className="container py-5">
          <div className="row g-5 mb-5">
            {[
              {
                key: 'linea-directa',
                href: 'tel:22396042',
                icon: 'fa-phone-alt',
                title: 'Línea directa',
                contact: '2239-6042'
              },
              {
                key: 'telefono-movil',
                href: 'https://wa.me/50686096382',
                icon: 'fa-mobile-alt',
                title: 'Teléfono móvil',
                contact: '8820-6326'
              },
              {
                key: 'direccion',
                href: 'https://www.google.com/maps/place/C.+Escobal,+Heredia,+San+Antonio/@9.9760037,-84.1982826,17z',
                icon: 'fa-map-marker-alt',
                title: 'Dirección',
                contact: 'C. Escobal, Heredia, Belén'
              }
            ].map(({ key, href, icon, title, contact }) => (
              <div key={key} className="col-lg-4">
                <div className="d-flex align-items-center wow fadeIn" data-wow-delay="0.1s">
                  <a href={href} className="text-white text-decoration-none" target={key === 'direccion' ? '_blank' : '_self'} rel="noopener noreferrer">
                    <div className="bg-primary d-flex align-items-center justify-content-center rounded" style={{ width: '60px', height: '60px' }}>
                      <i className={`fa ${icon} text-white`}></i>
                    </div>
                  </a>
                  <div className="ps-4">
                    <h5 className="mb-2">{title}</h5>
                    <h4 className="text-primary mb-0">
                      <a href={href} className="text-primary text-decoration-none" target={key === 'direccion' ? '_blank' : '_self'} rel="noopener noreferrer">
                        {contact}
                      </a>
                    </h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="row g-5">
            <div className="col-lg-6 wow slideInUp" data-wow-delay="0.3s">
              <Form form={form} onFinish={onFinish} layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="nombre"
                      label="Nombre"
                      rules={[{ required: true, message: 'Por favor ingrese su nombre' }]}
                    >
                      <Input placeholder="Nombre" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="correo"
                      label="Correo"
                      rules={[
                        { required: true, message: 'Por favor ingrese su correo' },
                        { type: 'email', message: 'Ingrese un correo válido' }
                      ]}
                    >
                      <Input placeholder="Correo" />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item
                  name="asunto"
                  label="Asunto"
                  rules={[{ required: true, message: 'Por favor ingrese el asunto' }]}
                >
                  <Input placeholder="Asunto" />
                </Form.Item>
                <Form.Item
                  name="mensaje"
                  label="Mensaje"
                  rules={[{ required: true, message: 'Por favor ingrese su mensaje' }]}
                >
                  <Input.TextArea rows={4} placeholder="Mensaje" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit" loading={isLoading} block>
                    Enviar Correo
                  </Button>
                </Form.Item>
              </Form>
            </div>
            <div className="col-lg-6 wow slideInUp" data-wow-delay="0.6s">
              <iframe className="position-relative rounded w-100 h-100"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.830963295064!2d-84.1872796847453!3d9.979365792906634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0fa3a13b80b07%3A0x5f3e8f0f1c6f0de6!2sC.%20Escobal%2C%20Heredia%2C%20Bel%C3%A9n%2C%20Costa%20Rica!5e0!3m2!1sen!2sus!4v1686087000000!5m2!1sen!2sus"
                style={{ minHeight: '350px', border: 0 }} allowFullScreen="" aria-hidden="false" tabIndex="0"></iframe>
            </div>
          </div>
        </div>
      </div>

      <motion.div initial="hidden" animate="visible" variants={boxVariants}>
        <WhyUs />
      </motion.div>
      {/* Contact End */}
    </>
  );
};

export default Contactenos;
