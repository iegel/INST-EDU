import React from "react";
import { useAuth } from "./context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";
import { ConfigProvider } from "antd";
import esES from "antd/lib/locale/es_ES";

function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();

  // Mientras estoy verificando el token, muestro un loading simple
  if (loading) return <h1>Loading...</h1>;

  // Si ya sé que no está autenticado, lo mando al login
  if (!loading && !isAuthenticated) return <Navigate to="/" replace />;

  // Si está autenticado, renderizo la ruta hija que corresponda
  return <Outlet />;
}

export default ProtectedRoute;