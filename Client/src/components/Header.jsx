import { React, useRef, useState, useEffect } from 'react';
import { useNavigate, NavLink } from "react-router-dom";
import { Button, OverlayPanel, DataTable, Column, Toast } from 'primereact';
import { Badge } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import CarouselHeader from './home/CarouselHeader';

export default function Header() {
  const navigate = useNavigate();
  const [updatedServicesDetails, setUpdatedServicesDetails] = useState([]);

  const toast = useRef(null);
  const op = useRef(null);

  const updateServicesFromStorage = () => {
    const storedServices = JSON.parse(localStorage.getItem('serviceRequests')) || [];
    setUpdatedServicesDetails(storedServices);
  };

  // Function to handle the deletion of a service
  const handleDelete = (id_servicio) => {
    try {
      // Get existing services from localStorage
      let serviceRequests = JSON.parse(localStorage.getItem('serviceRequests')) || [];

      // Filter out the service to be deleted
      serviceRequests = serviceRequests.filter(service => service.id_servicio !== id_servicio);

      // Update the localStorage with the new list
      localStorage.setItem('serviceRequests', JSON.stringify(serviceRequests));

      // Update the local state
      updateServicesFromStorage();

      // Show success message
      toast.current.show({ severity: 'success', summary: 'Servicio eliminado', detail: 'El servicio ha sido eliminado correctamente', life: 2000 });
    } catch (error) {
      // Show error message
      toast.current.show({ severity: 'error', summary: 'Error al eliminar', detail: 'Error al eliminar el servicio', life: 2000 });
    }
  };

  // Fetch services from localStorage on component mount and listen for storage changes
  useEffect(() => {
    updateServicesFromStorage();

    // Listen for storage changes
    const handleStorageChange = () => updateServicesFromStorage();
    window.addEventListener('storage', handleStorageChange);

    // Listen for custom event when a service is added
    const handleServiceAdded = () => updateServicesFromStorage();
    window.addEventListener('serviceAdded', handleServiceAdded);

    // Cleanup listeners on component unmount
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('serviceAdded', handleServiceAdded);
    };
  }, []);



  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true);
  const toggleMenu = () => setIsMenuCollapsed(!isMenuCollapsed);

  return (
    <div>
      <header>
        <nav className="navbar navbar-expand-lg">
          <div className="container">
            <button
              className="navbar-toggler"
              type="button"
              onClick={toggleMenu}
              aria-controls="navbarResponsive"
              aria-expanded={!isMenuCollapsed}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"><i className="bi bi-list"></i></span>
            </button>

            <div className={`collapse navbar-collapse ${!isMenuCollapsed ? 'show' : ''}`} id="navbarResponsive">
              <ul className="navbar-nav ml-auto" style={{ backgroundColor: "rgba(255, 255, 255, 0)", textAlign: "center" }}>
                <li className="nav-item">
                  <NavLink to="/" className="nav-link">
                    Inicio
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/Proceso_Solicitud" className="nav-link">
                    Proceso de Solicitud
                  </NavLink>
                </li>

                <li style={{ padding: "10px" }}>
                  <Button icon="pi pi-shopping-cart" style={{ backgroundColor: "rgba(255, 255, 255, 0)", borderRadius: "10px", border: "2px solid #FF8E03" }} onClick={(e) => op.current.toggle(e)} />
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
                                }} icon={<DeleteOutlined />} type="link" className="text-danger shadow-sm" onClick={() => handleDelete(rowData.id_servicio)} />
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
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>

      <CarouselHeader />
    </div>
  );
}
