import { useSelector } from "react-redux";
import { selectCurrentToken } from "../features/auth/authSlice";
import {jwtDecode} from "jwt-decode"; // Asegúrate de que la importación sea correcta, sin llaves si es exportación por defecto

const useAuth = () => {
    const token = useSelector(selectCurrentToken);
    if (token) {
        try {
            const decoded = jwtDecode(token);
            const { username, roles, userId } = decoded.UserInfo;
            console.log(decoded.UserInfo)
            return { userId, username, roles: roles || [] }; // Devuelve roles como un arreglo vacío si es undefined
        } catch (error) {
            console.error('Error decoding token:', error);
            // En caso de error en la decodificación, devolver valores predeterminados
            return { userId: null, username: null, roles: [] };
        }
    }
    // Devuelve valores predeterminados si no hay token
    return { userId: null, username: null, roles: [] };
};

export default useAuth;
