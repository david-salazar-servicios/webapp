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
function App() {
    return (
        <div>

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
                </Route>

                <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                        <Route path="mantenimiento" element={<MaintenanceLayout />}>
                            <Route path="index" element={<ProcessCalendar />}></Route>
                            <Route path="servicios" element={<Services />} />
                            <Route path="solicitudes" element={<Requests />} />
                            <Route path="categorias" element={<Categories />} />
                            <Route path="perfiles" element={<Users />} />
                            <Route path="roles" element={<Roles />} />
                        </Route>

                    </Route>
                </Route>

                {/*  <Route element={<PersistLogin />}>
                    <Route element={<RequireAuth allowedRoles={[...Object.values(ROLES)]} />}>
                    
                 </Route>
                </Route>*/}
            </Routes>
        </div>
    );
}

export default App;