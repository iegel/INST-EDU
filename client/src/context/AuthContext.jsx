import { createContext, useState,useContext, useEffect } from "react";
import { registerRequest, loginRequest,verifyTokenRequest} from '../api/auth';
import Cookies from 'js-cookie'

export const AuthContext = createContext();

// Custom hook para consumir el contexto de auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  // Datos del usuario logueado
  const [user, setUser] = useState(null);
  // Bandera de si hay sesión activa
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // Errores para mostrar en el login/registro
  const [errors, setErrors] = useState([]);
  // Para saber si todavía estoy chequeando el token
  const [loading, setLoading] = useState(true);
  // Bandera de si el usuario actual es Admin
  const [isAdmin, setIsAdmin] = useState(false);

  // Registro de usuario nuevo (no lo usás tanto en el front, pero queda)
  const signup = async (user) => {
    try {
      const res = await registerRequest(user);
      console.log(res.data);
    } catch (error) {
      console.error("Error en signup:", error);
      if (error.response) {
        setErrors(error.response.data);
      } else {
        setErrors(["No se pudo conectar con el servidor"]);
      }
    }
  };

  // Login de usuario
  const signin = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log(res);

      // Guardo los datos del usuario logueado
      setUser(res.data);
      setIsAuthenticated(true);

      // Si tiene rol Admin, prendo la bandera
      if (res.data.role === "Admin") {
        setIsAdmin(true);
      }

      setErrors([]);
    } catch (error) {
      console.error("Error en signin:", error);

      if (error.response) {
        // Si el backend manda un array de errores
        if (Array.isArray(error.response.data)) {
          return setErrors(error.response.data);
        }
        // Si manda un solo mensaje
        if (error.response.data?.message) {
          return setErrors([error.response.data.message]);
        }
        return setErrors(["Error en el servidor"]);
      }

      setErrors(["No se pudo conectar con el servidor"]);
    }
  };

  // Cerrar sesión en el frontend
  const logout = () => {
    // Borro la cookie del token
    Cookies.remove("token");
    // Limpio estados de auth
    setIsAuthenticated(false);
    setUser(null);
    setIsAdmin(false);
  };

  // Limpio mensajes de error automáticamente después de 5 segundos
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [errors]);

  // Al montar la app, chequeo si ya hay un token válido (mantener sesión)
  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get();

      // Si no hay token, no hay sesión
      if (!cookies.token) {
        setIsAuthenticated(false);
        setIsAdmin(false);
        setLoading(false);
        return setUser(null);
      }

      try {
        // Verifico el token con el backend
        const res = await verifyTokenRequest(cookies.token);
        console.log(res);

        if (!res.data) {
          setIsAuthenticated(false);
          setLoading(false);
          setIsAdmin(false);
          return;
        }

        // Si el token es válido, restauro la sesión
        setIsAuthenticated(true);
        setUser(res.data);

        if (res.data.role === "Admin") {
          setIsAdmin(true);
        }

        setLoading(false);
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
        setIsAdmin(false);
      }
    }

    checkLogin();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,
        signin,
        loading,
        user,
        isAuthenticated,
        errors,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};