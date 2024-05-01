import React from 'react';
import { Tabs } from 'antd';
import { useGetServicesQuery } from '../../features/services/ServicesApiSlice';
import { useGetCategoriasQuery } from '../../features/categorias/CategoriasApiSlice';
import { Link } from "react-router-dom";

export default function CardServices() {
  const { data: services, isLoading: isLoadingServices, isError: isErrorServices, error: errorServices } = useGetServicesQuery();
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories, error: errorCategories } = useGetCategoriasQuery();

  if (isLoadingServices || isLoadingCategories) return <div>Loading...</div>;
  if (isErrorServices || isErrorCategories) return <div>Error: {(errorServices || errorCategories).toString()}</div>;

  // Agrupar servicios por categoría
  const servicesByCategory = categories.reduce((acc, category) => {
    acc[category.id_categoria] = services.filter(service => service.id_categoria === category.id_categoria);
    return acc;
  }, {});

  // Crear el array de items para las pestañas, incluyendo una pestaña para 'Todas'
  const allServicesTab = {
    label: 'Todos',
    key: '0', // Asegúrate de que esta clave sea única y no se repita con las otras pestañas
    children: (
      <div className="row">
        {services.map((service, serviceIndex) => (
          <div key={service.id_servicio} className="col-md-4 d-flex">
            <div className="icon-box mb-5" data-aos="fade-up" data-aos-delay={`${100 + serviceIndex * 100}`}>
              <h4 className="title"><a href="">{service.nombre}</a></h4>
              <p className="description">{service.descripcion}</p>
              <Link to={`/Services/${service.id_servicio}`}>
                <span>Read More</span>
                <i className="bi bi-arrow-right" style={{paddingLeft:"5px"}}></i>
              </Link>
            </div>
          </div>
        ))}
      </div>
    )
  };

  const tabItems = [allServicesTab, ...categories.map((category, index) => {
    return {
      label: category.nombre,
      key: String(index + 1), // Asegúrate de que el índice comience en 1 para evitar conflictos con la pestaña 'Todas'
      children: (
        <div className="row">
          {servicesByCategory[category.id_categoria].map((service, serviceIndex) => (
            <div key={service.id_servicio} className="col-md-4 d-flex">
              <div className="icon-box mb-5" data-aos="fade-up" data-aos-delay={`${100 + serviceIndex * 100}`}>
                <h4 className="title"><a href="">{service.nombre}</a></h4>
                <p className="description">{service.descripcion}</p>
                <Link to={`/Services/${service.id_servicio}`}>
                  <span>Read More</span>
                  <i className="bi bi-arrow-right" style={{paddingLeft:"5px"}}></i>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )
    };
  })];

  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>Services</h2>
        </div>
        <Tabs defaultActiveKey="0" centered items={tabItems} />
      </div>
    </section>
  );
}
