import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
function App() {
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
                    {/* General protected routes for any allowed role */}
                    <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
                        <Route path="mantenimiento" element={<MaintenanceLayout />}>
                            <Route path="index" element={<ProcessCalendar />} />
                        </Route>
                    </Route>

                    {/* Admin-Only Routes */}
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
                        </Route>
                    </Route>

                    {/* Tecnico-Only Routes */}
                    <Route element={<RequireAuth allowedRoles={[ROLES.Tecnico]} />}>
                        <Route path="mantenimiento/index" element={<ProcessCalendar />} />
                    </Route>
                </Route>
            </Routes>
        </div>
    );
}

export default App;
