import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import CarouselHeader from './home/CarouselHeader';
import { Menubar } from 'primereact/menubar';
import { useGetServicesQuery } from '../features/services/ServicesApiSlice';
import { useGetCategoriasQuery } from '../features/categorias/CategoriasApiSlice';
import { motion } from 'framer-motion';
import { Space, Spin, Badge } from 'antd';
import { NavLink } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Button } from 'primereact/button';

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
  const op = useRef(null);
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
    <div className="header-container">
      <div className="site-navbar-wrap">
        <motion.div
          className="site-navbar-top container py-3"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="contact-info">
            <NavLink to="/" className="d-flex align-items-center" >
              <i className="bi bi-house"></i>
              <b><span className="d-none d-md-inline-block ml-2">Inicio</span></b>
            </NavLink>
            <a href="tel:22396042" className="d-flex align-items-center">
              <i className="bi bi-telephone"></i>
              <b><span className="d-none d-md-inline-block ml-2">2239-6042</span></b>
            </a>
            <a href="https://wa.me/50686096382" target='_blank' className="d-flex align-items-center">
              <i className="bi bi-phone"></i>
              <b><span className="d-none d-md-inline-block ml-2">8609-6382</span></b>
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
            <div className="menubar-with-cart">
              <Menubar model={menuItems} className="custom-menubar" />
              <div className="cart-container">
                <Button icon="pi pi-shopping-cart" style={{backgroundColor: "#FF8E03", borderRadius: "10px", border: "2px solid #FF8E03"}} onClick={(e) => op.current.toggle(e)} />
                <Badge count={updatedServicesDetails?.length || 0} overflowCount={99} style={{ backgroundColor: '#52c41a' }}>
                  <OverlayPanel ref={op} showCloseIcon id="overlay_panel" style={{ width: '450px', zIndex: 1000, position: 'relative' }}>
                    <Toast ref={toast} />
                    {(updatedServicesDetails && updatedServicesDetails.length > 0) ? (
                      <DataTable value={updatedServicesDetails} selectionMode="single" paginator rows={5}>
                        <Column field="nombre" header="Nombre" sortable style={{ minWidth: '12rem' }} />
                        <Column
                          body={(rowData) => (
                            <Button
                              shape="circle"
                              style={{
                                backgroundColor: 'transparent',
                                border: '1px solid white',
                                boxShadow: 'none',
                                color: "black",
                                borderRadius: '10px'
                              }}
                              icon={<DeleteOutlined />}
                              type="link"
                              className="text-danger shadow-sm"
                              onClick={() => handleDelete(rowData.id_servicio)}
                            />
                          )}
                          header="Acciones"
                          style={{ minWidth: '8rem' }}
                        />
                      </DataTable>
                    ) : (
                      <div>No hay servicios para mostrar</div>
                    )}
                  </OverlayPanel>
                </Badge>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <CarouselHeader />
      <div style={{ height: '5px', backgroundColor: '#ff8e00' }}>
      </div>
    </div>
  );
}
