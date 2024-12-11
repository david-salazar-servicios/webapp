import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './features/auth/Login';
import Home from './features/home/home';
import PersistLogin from './features/auth/PersistLogin';
import RequireAuth from './features/auth/RequireAuth';
import { ROLES } from './config/roles';
import Services from './features/services/Services';
import MaintenanceLayout from './layouts/MaintenanceLayout';
import Categories from './features/categorias/Categories';
import ServicesDetails from './components/services/ServicesDetails';
import Users from './features/users/Users';
import Roles from './features/roles/Roles';
import SignUp from './features/SignUp/SignUp';
import ResetPassword from './features/ForgotPassowrd/RequestResetPassowrd';
import ChangePassword from './features/ForgotPassowrd/ChangePassowrd';
import RequestServices from './components/requests/RequestServices';
import ProfileDetails from './components/Profile/ProfileDetails';
import ProcessCalendar from './components/calendar/ProcessCalendar';
import Requests from './features/RequestService/Requests';
import Contactenos from './components/contacto/contacto';
import AboutUs from './components/about/about';
import Testimonials from './components/testimonials/testimonials';
import CardServices from './components/services/CardServices';
import Privacidad from './components/privacidad/privacidad';
import Proyectos from './components/proyectos/proyectos';
import Novedades from './components/novedades/novedades';
import ScrollToTop from './components/ScrollToTop';
import ProformasTable from './components/proforma/ProformasTable';
import Catalogo from './components/Inventario/Catalogo'
import Inventario from './components/Inventario/Inventario'
import GestionInventario from './components/Inventario/GestionInventario'
import CuentaIbanForm from './components/Cuentaiban/CuentaibanForm';
import Proforma from './components/proforma/Proforma';
import CrearSolicitud from './components/services/CrearSolicitud'
import useAuth from './hooks/useAuth';
import Reportes from './components/Charts/Reportes';

function App() {
    const { roles } = useAuth(); // Assuming this fetches the roles of the logged-in user
    const userRoles = roles || []; // Default to an empty array if roles are undefined

    return (
        <div>
            <ScrollToTop />
            <Routes>
                <Route path="/Login" element={<Login />} />
                <Route path="/Registrar" element={<SignUp />} />
                <Route path="/RecuperarContrasenna" element={<ResetPassword />} />
                <Route path="/CambiarContrasenna" element={<ChangePassword />} />
                <Route path="/" element={<MainLayout />}>
                    <Route index element={<Home />} />
                    <Route path="Services/:id" element={<ServicesDetails />} />
                    <Route path="/Proceso_Solicitud" element={<RequestServices />} />
                    <Route path="/Mi_Perfil" element={<ProfileDetails />} />
                    <Route path="/contacto" element={<Contactenos />} />
                    <Route path="/About" element={<AboutUs />} />
                    <Route path="/testimonios" element={<Testimonials />} />
                    <Route path="/servicios" element={<CardServices />} />
                    <Route path="/privacidad" element={<Privacidad />} />
                    <Route path="/proyectos" element={<Proyectos />} />
                    <Route path="/novedades" element={<Novedades />} />
                </Route>

                {/* Protected Routes */}
                <Route element={<PersistLogin />}>
                    {/* General Protected Routes */}
                    <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
                        <Route path="mantenimiento" element={<MaintenanceLayout />}>
                            <Route path="" element={<ProcessCalendar />} />
                        </Route>
                    </Route>

                    {/* Role-Based Routes */}
                    {userRoles.includes(ROLES.Admin) ? (
                        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                            <Route path="mantenimiento" element={<MaintenanceLayout />}>
                                <Route path="servicios" element={<Services />} />
                                <Route path="solicitudes" element={<Requests />} />
                                <Route path="categorias" element={<Categories />} />
                                <Route path="perfiles" element={<Users />} />
                                <Route path="roles" element={<Roles />} />
                                <Route path="proformas" element={<ProformasTable />} />
                                <Route path="proformas/create" element={<Proforma />} />
                                <Route path="proformas/:id_proforma" element={<Proforma />} />
                                <Route path="Catalogo" element={<Catalogo />} />
                                <Route path="Inventario" element={<Inventario />} />
                                <Route path="cuentaiban" element={<CuentaIbanForm />} />
                                <Route path="GestionInventario" element={<GestionInventario />} />
                                <Route path="CrearSolicitud" element={<CrearSolicitud />} />
                                <Route path="reportes" element={<Reportes />} />
                            </Route>
                        </Route>
                    ) : userRoles.includes(ROLES.Tecnico) ? (
                        <Route element={<RequireAuth allowedRoles={[ROLES.Tecnico]} />}>
                            <Route path="mantenimiento" element={<MaintenanceLayout />}>
                                <Route path="" element={<ProcessCalendar />} />
                                <Route path="solicitudes" element={<Requests />} />
                                <Route path="proformas" element={<ProformasTable />} />
                                <Route path="proformas/create" element={<Proforma />} />
                                <Route path="proformas/:id_proforma" element={<Proforma />} />
                                <Route path="Inventario" element={<Inventario />} />
                            </Route>
                        </Route>
                    ) : userRoles.includes(ROLES.Inventario) ? (
                        <Route element={<RequireAuth allowedRoles={[ROLES.Inventario]} />}>
                           <Route path="mantenimiento" element={<MaintenanceLayout />}>
                                <Route path="" element={<GestionInventario />} />
                                <Route path="GestionInventario" element={<GestionInventario />} />
                            </Route>
                        </Route>
                    ) : (
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    )}
                </Route>
            </Routes>
        </div>
    );
}


export default App;
