import React from 'react';
import { Tabs } from 'antd';
import { useGetServicesQuery } from '../../features/services/ServicesApiSlice';
import { useGetCategoriasQuery } from '../../features/categorias/CategoriasApiSlice';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Animation variants
const boxVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
  fromLeftToCenter: { opacity: 1, x: [-300, 0] },
};

const textVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  fromRightToCenter: { opacity: 1, x: [300, 0] },
};

// Title component with animation
const AnimatedTitle = ({ title }) => {
  const [ref, inView] = useInView({});

  return (
    <motion.div
      ref={ref}
      variants={textVariants}
      initial="hidden"
      animate={inView ? "fromRightToCenter" : "hidden"}
      transition={{ duration: 0.5 }}
      className="section-title"
      data-aos="fade-up"
    >
      <h2>{title}</h2>
    </motion.div>
  );
};

// Service card component with animation
const AnimatedServiceCard = ({ service, delay }) => {
  const [ref, inView] = useInView({});

  return (
    <motion.div
      ref={ref}
      className="col-md-4 d-flex"
      variants={boxVariants}
     
      animate={inView ? "fromLeftToCenter" : "hidden"}
      transition={{ duration: 0.5, delay }}
    >
      <div className="icon-box mb-5" data-aos="fade-up">
        <h4 className="title"><a href="">{service.nombre}</a></h4>
        <p className="description">{service.descripcion.length > 250 ? service.descripcion.substring(0, 250) + "..." : service.descripcion}</p>
        <Link to={`/Services/${service.id_servicio}`}>
          <span>Leer más</span>
          <i className="bi bi-arrow-right" style={{ paddingLeft: "5px" }}></i>
        </Link>
      </div>
    </motion.div>
  );
};

export default function CardServices() {
  const { data: response, isLoading, isError, error } = useGetServicesQuery();
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories, error: errorCategories } = useGetCategoriasQuery();

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.toString()}</div>;

  if (!response) return <div>No data available</div>;

  const { servicios, categorias } = response;

  // Filter services by category
  const servicesByCategory = categorias.reduce((acc, category) => {
    if (!acc[category.id_categoria]) {
      acc[category.id_categoria] = [];
    }
    const service = servicios.find(service => service.id_servicio === category.id_servicio);
    if (service) {
      acc[category.id_categoria].push(service);
    }
    return acc;
  }, {});

  // Crear el array de items para las pestañas, incluyendo una pestaña para 'Todas'
  const allServicesTab = {
    label: 'Todos',
    key: '0', // Ensure this key is unique and does not repeat with other tabs
    children: (
      <div className="row">
        {servicios.map((service, serviceIndex) => (
          <AnimatedServiceCard key={service.id_servicio} service={service} delay={0.1 * serviceIndex} />
        ))}
      </div>
    )
  };

  // Map services to tab items
  const tabItems = [
    allServicesTab,
    ...Object.entries(servicesByCategory).map(([categoryId, services]) => {
      const categoryName = categories.find(category => category.id_categoria.toString() === categoryId)?.nombre || 'Unknown Category';
      return {
        label: categoryName,
        key: categoryId,
        children: (
          <div className="row">
            {services.map((service, serviceIndex) => (
              <AnimatedServiceCard key={service.id_servicio} service={service} delay={0.1 * serviceIndex} />
            ))}
          </div>
        )
      };
    })
  ];

  return (
    <section id="services" className="services">
      <div className="container">
        <AnimatedTitle title="Servicios" />
        <Tabs defaultActiveKey="0" centered items={tabItems} />
      </div>
    </section>
  );
}
