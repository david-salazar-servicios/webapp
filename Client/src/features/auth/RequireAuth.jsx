import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { toast } from 'react-toastify';

const RequireAuth = ({ allowedRoles }) => {
  const location = useLocation();
  const { roles } = useAuth(); // Puedes asegurarte de que esto sea un arreglo en el hook useAuth, o manejarlo aquí

  // Si roles es undefined, entonces utiliza un arreglo vacío como valor predeterminado
  const userRoles = roles || [];

  // Continúa si no hay roles definidos (o roles es un arreglo vacío) o si hay una intersección entre los roles permitidos y los roles del usuario
  if (!allowedRoles.length || !userRoles.some(role => allowedRoles.includes(role))) {
    toast.error("Acceso denegado. No tienes permiso para acceder a esta página.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default RequireAuth;
