import { React, useRef, useState, useEffect } from 'react';
import useAuth from "../hooks/useAuth";
import { useSendLogoutMutation } from '../features/auth/authApiSlice';
import { useNavigate, NavLink } from "react-router-dom";
import { Button, OverlayPanel, DataTable, Column, Toast } from 'primereact';
import { useGetUserServicesQuery, useGetServicesByIdsQuery } from '../features/services/ServicesApiSlice';
import { useDeleteUserServiceMutation } from '../features/services/ServicesApiSlice';
import { DeleteOutlined } from '@ant-design/icons';

import { Badge } from 'antd';
import CarouselHeader from './home/CarouselHeader';

export default function Header() {
  const [sendLogout, { isLoading }] = useSendLogoutMutation();
  const navigate = useNavigate();
  const auth = useAuth() || {};
  const { username = null } = auth;
  const [updatedServicesDetails, setUpdatedServicesDetails] = useState([]);

  const [deleteService, { isLoading: isDeleting }] = useDeleteUserServiceMutation();

  const handleDelete = async (id_servicio) => {
    try {

      await deleteService({ id_servicio, id_usuario: auth.userId }).unwrap();
      toast.current.show({ severity: 'success', summary: 'Servicio eliminado', detail: 'El servicio ha sido eliminado correctamente', life: 2000 });

      // Actualiza el estado local para reflejar la eliminación
      setUpdatedServicesDetails(prevDetails => prevDetails.filter(service => service.id_servicio !== id_servicio));

    } catch (error) {
      toast.current.show({ severity: 'error', summary: 'Error al eliminar', detail: 'Error al eliminar el servicio', life: 2000 });
    }
  };


  const op = useRef(null);
  const toast = useRef(null);
  const { data: userServices, isLoading: isLoadingUserServices } = useGetUserServicesQuery(auth.userId);

  let isEmpty = !userServices || userServices.length === 0;

  const serviceIds = isEmpty ? [] : userServices.map(service => service.id_servicio);

  const { data: servicesDetails } = useGetServicesByIdsQuery(serviceIds, { skip: isEmpty });
  useEffect(() => {
    if (!isEmpty && servicesDetails) {
      setUpdatedServicesDetails(servicesDetails);
    } else {
      setUpdatedServicesDetails([]);
    }
  }, [servicesDetails, isEmpty]);

  const handleSubmit = async () => {
    try {
      await sendLogout().unwrap();
      navigate('/Login');
    } catch (err) {
      console.error('Logout failed: ', err);
    }
  };
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(true); // Estado para controlar la visibilidad del menú

  const toggleMenu = () => {
    setIsMenuCollapsed(!isMenuCollapsed); // Cambia el estado del menú cada vez que se haga clic
  };
  if (isLoadingUserServices) return <div>Cargando servicios...</div>;

  return (
    <div>
      <>
        <header>
          <nav className="navbar navbar-expand-lg">
            <div className="container">
              <a className="navbar-brand" href="index.html">
              </a>
              <button
                className="navbar-toggler"
                type="button"
                onClick={toggleMenu} // Usa la función toggleMenu para cambiar el estado
                aria-controls="navbarResponsive"
                aria-expanded={!isMenuCollapsed} // Ajusta este valor basado en el estado
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"><i className="bi bi-list"></i></span>
              </button>

              <div className={`collapse navbar-collapse ${!isMenuCollapsed ? 'show' : ''}`} id="navbarResponsive">
                <ul className="navbar-nav ml-auto" style={{ backgroundColor: "rgba(255, 255, 255, 0)", textAlign:"center" }}>
                  <li className="nav-item">
                    <NavLink to="/" className="nav-link">
                      Inicio
                    </NavLink>
                  </li>
                  <li className="nav-item dropdown">
                    <a className="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      {username}
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink" style={{ backgroundColor: "rgba(255, 255, 255, 0)" }}>
                      <li>
                        <NavLink to="/Mi_Perfil" className="nav-link">
                          <i className="bi bi-person"></i> Mi Perfil
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/account-settings" className="nav-link">
                          <i className="bi bi-gear"></i> Account Settings
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/faq" className="nav-link">
                          <i className="bi bi-question-circle"></i> Need Help?
                        </NavLink>
                      </li>
                      <li>
                      </li>

                    </ul>
                  </li>
                  <li className="nav-item">
                    <NavLink to="/Proceso_Solicitud" className="nav-link">
                      Proceso de Solicitud
                    </NavLink>
                  </li>


                  <li className="nav-item">
                    <NavLink to="/Login" className="nav-link" onClick={handleSubmit}>
                      <i className="bi bi-box-arrow-right"></i> Salir
                    </NavLink>
                  </li>
                  <li style={{padding:"10px"}}>
                    <Button icon="pi pi-shopping-cart" style={{backgroundColor: "rgba(255, 255, 255, 0)", borderRadius: "10px", border: "2px solid #FF8E03"}} onClick={(e) => op.current.toggle(e)} />
                    <Badge count={updatedServicesDetails?.length || 0} overflowCount={99} style={{ backgroundColor: '#52c41a' }}>

                      <OverlayPanel ref={op} showCloseIcon id="overlay_panel" style={{ width: '450px', zIndex: 1000, position: 'relative' }}>
                        <Toast ref={toast} />
                        {/* Cambiamos la condición para verificar también si servicesDetails es vacío o no está definido */}
                        {(updatedServicesDetails && updatedServicesDetails.length > 0) ? (
                          <DataTable value={updatedServicesDetails} selectionMode="single" paginator rows={5}>
                            <Column field="nombre" header="Nombre" sortable style={{ minWidth: '12rem' }} />
                            <Column
                              body={(rowData) => (

                                <Button shape="circle"
                                  style={{
                                    backgroundColor: 'transparent',
                                    border: '1px solid white',
                                    boxShadow: 'none',
                                    color: "black",
                                    borderRadius: '10px'
                                  }} icon={<DeleteOutlined />} type="link" className="text-danger shadow-sm" onClick={() => handleDelete(rowData.id_servicio)} disabled={isDeleting} />

                              )}
                              header="Acciones"
                              style={{ minWidth: '8rem' }}
                            />
                          </DataTable>
                        ) : (
                          // Este es el estado que se mostrará cuando no haya servicios disponibles para mostrar
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
      </>
    </div>
  );
}
