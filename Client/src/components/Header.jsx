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

  console.log("Services:", services);
  console.log("Categories:", categories);

  if (!services || !categories || !Array.isArray(services) || !Array.isArray(categories)) {
    console.error("Unexpected data format:", { services, categories });
    return <div>Error: Data is not in expected format</div>;
  }

  const servicesByCategory = categories.reduce((acc, category) => {
    acc[category.id_categoria] = services.filter(service => service.id_categoria === category.id_categoria);
    return acc;
  }, {});

  const menuItems = [
    { label: 'Inicio', key: 'Inicio', command: () => navigate('/') },
    { label: 'Sobre Nosotros', key: 'SobreNosotros', command: () => navigate('/About') },
    {
      label: 'Servicios',
      key: 'Servicios',
      items: categories.map(category => ({
        label: category.nombre,
        key: `category-${category.id_categoria}`,
        items: servicesByCategory[category.id_categoria]?.map(service => ({
          label: service.nombre,
          key: `service-${service.id_servicio}`,
          command: () => navigate(`/Services/${service.id_servicio}`)
        })) || [],
      }))
    },
    { label: 'Contacto', key: 'Contacto', command: () => navigate('/Contact') }
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
          {/* Contact and social media links here */}
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
        {/* Other components */}
      </div>

      <CarouselHeader />
    </div>
  );
}
