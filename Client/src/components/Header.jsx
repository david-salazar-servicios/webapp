import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import CarouselHeader from './home/CarouselHeader';
import { Menubar } from 'primereact/menubar';
import { useGetServicesQuery } from '../features/services/ServicesApiSlice';
import { useGetCategoriasQuery } from '../features/categorias/CategoriasApiSlice';
import { motion } from 'framer-motion';

export default function Header() {
  const navigate = useNavigate();
  const [updatedServicesDetails, setUpdatedServicesDetails] = useState([]);
  const toast = useRef(null);

  const updateServicesFromStorage = () => {
    const storedServices = JSON.parse(localStorage.getItem('serviceRequests')) || [];
    setUpdatedServicesDetails(storedServices);
  };

  const handleDelete = (id_servicio) => {
    try {
      let serviceRequests = JSON.parse(localStorage.getItem('serviceRequests')) || [];
      serviceRequests = serviceRequests.filter(service => service.id_servicio !== id_servicio);
      localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));
      updateServicesFromStorage();
      toast.current.show({ severity: 'success', summary: 'Servicio eliminado', detail: 'El servicio ha sido eliminado correctamente', life: 2000 });
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error al eliminar', detail: 'Error al eliminar el servicio', life: 2000 });
    }
  };

  useEffect(() => {
    updateServicesFromStorage();
    const handleStorageChange = () => updateServicesFromStorage();
    window.addEventListener('storage', handleStorageChange);
    const handleServiceAdded = () => updateServicesFromStorage();
    window.addEventListener('serviceAdded', handleServiceAdded);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('serviceAdded', handleServiceAdded);
    };
  }, []);

  const { data: services, isLoading: isLoadingServices, isError: isErrorServices, error: errorServices } = useGetServicesQuery();
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories, error: errorCategories } = useGetCategoriasQuery();

  if (isLoadingServices || isLoadingCategories) return <div>Loading...</div>;
  if (isErrorServices || isErrorCategories) return <div>Error: {(errorServices || errorCategories).toString()}</div>;

  const servicesByCategory = categories.reduce((acc, category) => {
    acc[category.id_categoria] = services.filter(service => service.id_categoria === category.id_categoria);
    return acc;
  }, {});

  const menuItems = [
    { label: 'Inicio', command: () => navigate('/') },
    { label: 'Sobre Nosotros', command: () => navigate('/About') },
    {
      label: 'Servicios',
      items: categories.map(category => ({
        label: category.nombre,
        items: servicesByCategory[category.id_categoria]?.map(service => ({
          label: service.nombre,
          command: () => navigate(`/Services/${service.id_servicio}`)
        })) || [],
      }))
    },
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
              <span className="d-none d-md-inline-block ml-2">8820-6326</span>
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
              <h6>Invierta solo una vez</h6>
              <h4>Servicios Residenciales &amp; Comerciales CRLTDA</h4>
              <a
                href="#"
                className="filled-button"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/contacto');
                }}
              >
                Contáctanos
              </a>
            </motion.div>

          </motion.div>
        </div>
      </div>

      <CarouselHeader />
    </div>
  );
}
