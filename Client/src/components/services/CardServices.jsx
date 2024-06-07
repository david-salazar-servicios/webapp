import React from 'react';
import { Tabs } from 'antd';
import { useGetServicesQuery } from '../../features/services/ServicesApiSlice';
import { useGetCategoriasQuery } from '../../features/categorias/CategoriasApiSlice';
import { Link } from "react-router-dom";

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
          <div key={service.id_servicio} className="col-md-4 d-flex">
            <div className="icon-box mb-5" data-aos="fade-up" data-aos-delay={`${100 + serviceIndex * 100}`}>
              <h4 className="title"><a href="">{service.nombre}</a></h4>
              <p className="description">{service.descripcion.length > 250 ? service.descripcion.substring(0, 250) + "..." : service.descripcion}</p>
              <Link to={`/Services/${service.id_servicio}`}>
                <span>Leer más</span>
                <i className="bi bi-arrow-right" style={{paddingLeft:"5px"}}></i>
              </Link>
            </div>
          </div>
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
            {services.map(service => (
              <div key={service.id_servicio} className="col-md-4 d-flex">
                <div className="icon-box mb-5" data-aos="fade-up">
                  <h4 className="title"><a href="">{service.nombre}</a></h4>
                  <p className="description">{service.descripcion.length > 250 ? service.descripcion.substring(0, 250) + "..." : service.descripcion}</p>
                  <Link to={`/Services/${service.id_servicio}`}>
                    <span>Leer más</span>
                    <i className="bi bi-arrow-right" style={{paddingLeft:"5px"}}></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      };
    })
  ];


  return (
    <section id="services" className="services">
      <div className="container">
        <div className="section-title" data-aos="fade-up">
          <h2>Servicios</h2>
        </div>
        <Tabs defaultActiveKey="0" centered items={tabItems} />
      </div>
    </section>
  );
}
