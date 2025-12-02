import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

function ProtectedRouteAdmin() {
  const { loading, isAuthenticated, user } = useAuth();

  if (loading) return <div className="p-4">Cargando...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 👇 solo Admin puede seguir
  if (user?.role !== "Admin") {
    // lo mandamos a la lista de alumnos, que es lo único que puede usar
    return <Navigate to="/alumnos" replace />;
  }

  return <Outlet />;
}

export default ProtectedRouteAdmin;
