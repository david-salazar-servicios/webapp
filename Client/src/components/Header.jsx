import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import CarouselHeader from './home/CarouselHeader';
import { Menubar } from 'primereact/menubar';
import { useGetServicesQuery } from '../features/services/ServicesApiSlice';
import { useGetCategoriasQuery } from '../features/categorias/CategoriasApiSlice';
import { motion } from 'framer-motion';
import { Space, Spin, Switch } from 'antd';
import { NavLink } from 'react-router-dom';

const Loader = () => {
  const [auto, setAuto] = useState(false);
  const [percent, setPercent] = useState(-50);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPercent((v) => {
        const nextPercent = v + 5;
        return nextPercent > 150 ? -50 : nextPercent;
      });
    }, 100);
    return () => {
      clearTimeout(timeout);
    };
  }, [percent]);

  const mergedPercent = auto ? 'auto' : percent;
  return (
    <div className="loader-container">
      <Space>
        <Spin percent={mergedPercent} size="large" />
      </Space>
    </div>
  );
};

export default function Header() {
  const navigate = useNavigate();
  const toast = useRef(null);
  const [updatedServicesDetails, setUpdatedServicesDetails] = useState([]);

  const updateServicesFromStorage = () => {
    const storedServices = JSON.parse(localStorage.getItem('serviceRequests')) || [];
    setUpdatedServicesDetails(storedServices);
  };

  const handleDelete = (id_servicio) => {
    try {
      const serviceRequests = JSON.parse(localStorage.getItem('serviceRequests')) || [];
      const updatedRequests = serviceRequests.filter(service => service.id_servicio !== id_servicio);
      localStorage.setItem('serviceRequests', JSON.stringify(updatedRequests));
      updateServicesFromStorage();
      toast.current.show({ severity: 'success', summary: 'Servicio eliminado', detail: 'El servicio ha sido eliminado correctamente', life: 2000 });
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error al eliminar', detail: 'Error al eliminar el servicio', life: 2000 });
    }
  };

  useEffect(() => {
    updateServicesFromStorage();
    const handleStorageChange = () => updateServicesFromStorage();
    const handleServiceAdded = () => updateServicesFromStorage();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('serviceAdded', handleServiceAdded);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('serviceAdded', handleServiceAdded);
    };
  }, []);

  const { data: servicesResponse, isLoading: isLoadingServices, isError: isErrorServices, error: errorServices } = useGetServicesQuery();
  const { data: categoriesResponse, isLoading: isLoadingCategories, isError: isErrorCategories, error: errorCategories } = useGetCategoriasQuery();

  if (isLoadingServices || isLoadingCategories) return <Loader />;
  if (isErrorServices || isErrorCategories) return <div>Error: {(errorServices || errorCategories).toString()}</div>;

  if (!servicesResponse || !categoriesResponse) return <div>No data available</div>;

  const { servicios } = servicesResponse;
  const categoryMappings = servicesResponse.categorias;
  const categories = categoriesResponse;

  const servicesByCategory = categories.reduce((acc, category) => {
    const services = categoryMappings
      .filter(mapping => mapping.id_categoria === category.id_categoria)
      .map(mapping => servicios.find(service => service.id_servicio === mapping.id_servicio))
      .filter(service => service !== undefined);

    if (services.length > 0) {
      acc[category.id_categoria] = services;
    }
    return acc;
  }, {});

  const menuItems = [
    { label: 'Inicio', key: 'Inicio', command: () => navigate('/') },
    {
      label: 'Servicios',
      key: 'Servicios',
      items: Object.entries(servicesByCategory).map(([categoryId, services]) => {
        const category = categories.find(cat => cat.id_categoria.toString() === categoryId);
        return {
          label: category.nombre,
          key: `category-${categoryId}`,
          items: services.reduce((acc, service, index) => {
            acc.push({
              label: service.nombre,
              key: `service-${service.id_servicio}`,
              command: () => navigate(`/Services/${service.id_servicio}`)
            });

            // Add a separator after each service item except the last one
            if (index < services.length - 1) {
              acc.push({ separator: true });
            }

            return acc;
          }, [])
        };
      })
    },
    { label: 'Sobre Nosotros', key: 'SobreNosotros', command: () => navigate('/About') },
    { label: 'Proyectos', command: () => navigate('/proyectos') },
    { label: 'Contacto', command: () => navigate('/contacto') }
  ];

  return (
    <div>
      <div className="site-navbar-wrap">
        <motion.div
          className="site-navbar-top container py-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="contact-info">
            <a href="tel:22396042" className="d-flex align-items-center">
              <i className="bi bi-telephone"></i>
              <span className="d-none d-md-inline-block ml-2">2239-6042</span>
            </a>
            <a href="https://wa.me/50686096382" target='_blank' className="d-flex align-items-center">
              <i className="bi bi-phone"></i>
              <span className="d-none d-md-inline-block ml-2">8609-6382</span>
            </a>
          </div>
          <div className="social-icons">
            <a href="https://wa.me/50686096382" target='_blank'><i className="bi bi-whatsapp"></i></a>
            <a href="https://www.tiktok.com/@davidsalazarcr" target='_blank'><i className="bi bi-tiktok"></i></a>
            <a href="https://www.instagram.com/davidsalazar_cr" target='_blank'><i className="bi bi-instagram"></i></a>
            <a href="https://www.facebook.com/profile.php?id=100037466996673" target='_blank'><i className="bi bi-facebook"></i></a>
            <a href="https://www.facebook.com/profile.php?id=100011746801863&mibextid=2JQ9oc" target='_blank'><i className="bi bi-droplet"></i></a>
          </div>
        </motion.div>
        <div className="mt-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Menubar model={menuItems} className="custom-menubar" />

          </motion.div>
        </div>
        <div className="mt-3">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div
              className="fixed-text-content mt-5"
              initial={{ y: '20vh', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 50, damping: 20 }}
            >
              <h6 style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
              }}>Invierta solo una vez</h6>
              <h4 style={{
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.7)'
              }}>Servicios Residenciales &amp; Comerciales CRLTDA</h4>
              <NavLink to="/contacto" className="filled-button" >
                Contáctanos
              </NavLink>
            </motion.div>

          </motion.div>
        </div>
      </div>

      <CarouselHeader />
      <div style={{ height: '5px', backgroundColor: '#ff8e00' }}>
      </div>
    </div>
  );
}
