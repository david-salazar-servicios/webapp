import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CarouselHeader from './home/CarouselHeader';
import { Menubar } from 'primereact/menubar';
import { useGetServicesQuery } from '../features/services/ServicesApiSlice';
import { useGetCategoriasQuery } from '../features/categorias/CategoriasApiSlice';
import { motion } from 'framer-motion';
import { Space, Spin, Card, Badge } from 'antd';
import { NavLink } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { ShoppingCartOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';
import { Button } from 'primereact/button';
import { useMediaQuery } from 'react-responsive'; // Importa el hook para media queries

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
  const navigate = useNavigate(); // Use navigate for redirect
  const op = useRef(null);
  const isMobile = useMediaQuery({ maxWidth: 1500 });
  const [updatedServicesDetails, setUpdatedServicesDetails] = useState([]);
  const [showNotification, setShowNotification] = useState(false);


  const updateServicesFromStorage = () => {
    const storedServices = JSON.parse(localStorage.getItem('serviceRequests')) || [];
    setUpdatedServicesDetails(storedServices);
    setShowNotification(storedServices.length > 0);
  };


  useEffect(() => {
    updateServicesFromStorage();

    const handleStorageChange = () => updateServicesFromStorage();
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);



  const renderTableContent = () => (
    updatedServicesDetails.length > 0 ? (
      <DataTable
        value={updatedServicesDetails}
        selectionMode="single"
        rows={5}
        style={{ fontSize: '0.90em' }}
        className="compact-paginator"
      >
        <Column
          field="nombre"
          header="Nombre"
          sortable
          style={{ minWidth: '10rem', padding: '0.5rem 0.5rem' }}
        />
        <Column
          body={(rowData) => (
            <Button
              style={{
                backgroundColor: 'transparent',
                border: '1px solid white',
                boxShadow: 'none',
                color: 'black',
                borderRadius: '10px',
                padding: '0.2rem',
                fontSize: '1em',
              }}
              icon={<DeleteOutlined style={{ fontSize: '1em' }} />}
              type="link"
              className="text-danger shadow-sm"
              onClick={() => handleDelete(rowData.id_servicio)}
            />
          )}
          header="Eliminar"
          style={{ minWidth: '6rem', padding: '0.5rem' }}
        />
      </DataTable>
    ) : (
      <div style={{ fontSize: '0.85em' }}>No hay servicios para mostrar</div>
    )
  );

  useEffect(() => {

    updateServicesFromStorage();

    const handleStorageChange = () => updateServicesFromStorage();
    const handleServiceUpdated = () => updateServicesFromStorage();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('serviceUpdated', handleServiceUpdated);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('serviceUpdated', handleServiceUpdated);
    };
  }, []);


  const handleDelete = (id_servicio) => {
    try {
      let serviceRequests = JSON.parse(localStorage.getItem('serviceRequests')) || [];
      serviceRequests = serviceRequests.filter(service => service.id_servicio !== id_servicio);
      localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));

      // Dispatch an event to notify all components of the service deletion
      const event = new Event('serviceUpdated');
      window.dispatchEvent(event);
      setShowNotification(serviceRequests.length > 0);
      // Show a success message
    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar el servicio', life: 3000 });
    }
  };
  const handleConfirmarPedido = () => {
    // Redirect to /Proceso_Solicitud when the button is clicked
    navigate('/Proceso_Solicitud');
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
      {showNotification && (
        <div style={{ position: 'fixed', top: '10px', right: '10px', zIndex: 1000 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {isMobile ? (
                <></>
            ) : (
              // Modo de Pantalla Completa: muestra el Card completo
              <Card
                className="cardNotification"
                type="inner"
                style={{
                  width: '100%',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'height 0.3s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <ShoppingCartOutlined style={{ fontSize: '1rem', marginRight: '0.5rem', color: '#003F7D', marginBottom: '10px' }} />
                    <h6 style={{ color: '#003F7D' }}>Servicios Solicitados</h6>
                  </div>
                </div>


                <>
                  {renderTableContent()}

                  <Button
                    className="btn btn-primary btn-block d-flex justify-content-center mt-2"
                    onClick={handleConfirmarPedido}
                    style={{
                      fontSize: '0.85em',
                      padding: '0.3rem 0.6rem',
                      width: '100%',
                    }}
                  >
                    Confirmar Pedido
                  </Button>
                </>

              </Card>
            )}
          </motion.div>
        </div>
      )}
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
            {showNotification && isMobile && (
              <Badge count={updatedServicesDetails.length} offset={[0, 50]} style={{backgroundColor:'#05579E'}}>
                <Button
                  icon="pi pi-shopping-cart"
                  className='buttonCart'
                  style={{
                    backgroundColor: "#05579E",
                    borderRadius: "10px",
                    top: '12px',  // Espacio entre el ícono y los demás
                    marginLeft:'5px'
                  }}
                  onClick={handleConfirmarPedido}
                />
              </Badge>
            )}
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
              <div className="cart-container" style={{ position: 'relative' }}>
              </div>

            </div>
          </motion.div>
        </div>
      </div>

      <CarouselHeader />
      <div style={{ height: '5px', backgroundColor: '#ff8e00' }}></div>
    </div>
  );
}