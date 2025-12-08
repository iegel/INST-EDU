import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Páginas principales
import LoginPage from "./pages/LoginPage";
import AlumnosPage from "./pages/AlumnosPage";
import AlumnosFormPage from "./pages/AlumnosFormPage";
import BoletinPage from "./pages/BoletinPage";
import UsuariosPage from "./pages/UsuariosPage";
import UsuariosFormPage from "./pages/UsuariosFormPage";
import ComisionesPage from "./pages/ComisionesPage";
import ComisionesFormPage from "./pages/ComisionesFormPage";
import MateriasPage from "./pages/MateriasPage";
import MateriasFormPage from "./pages/MateriasFormPage";

// Rutas protegidas según login / rol
import ProtectedRoute from "./ProtectedRoute";
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";

function App() {
  return (
    <>
      {/* Barra de navegación visible en todas las páginas */}
      <Navbar />

      <Routes>
        {/* Ruta pública: login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rutas protegidas para cualquier usuario logueado (Admin o Preceptor) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/alumnos" element={<AlumnosPage />} />
          <Route path="/add-alumno" element={<AlumnosFormPage />} />
          <Route path="/alumnos/:id" element={<AlumnosFormPage />} />

          {/* Boletín de un alumno */}
          <Route path="/boletin/:id" element={<BoletinPage />} />

          {/* Lista de materias */}
          <Route path="/materias" element={<MateriasPage />} />

        </Route>

        {/* Rutas exclusivas para Admin */}
        <Route element={<ProtectedRouteAdmin />}>
          {/* ABM de usuarios */}
          <Route path="/usuarios" element={<UsuariosPage />} />
          <Route path="/usuarios/:id" element={<UsuariosFormPage />} />
          <Route path="/add-usuario" element={<UsuariosFormPage />} />

          {/* ABM de comisiones */}
          <Route path="/comisiones" element={<ComisionesPage />} />
          <Route path="/add-comision" element={<ComisionesFormPage />} />
          <Route path="/comisiones/:id" element={<ComisionesFormPage />} />

          {/* ABM de materias */}
          <Route path="/add-materia" element={<MateriasFormPage />} />
          <Route path="/materias/:id" element={<MateriasFormPage />} />
        </Route>

        {/* Cualquier ruta rara me lleva al login */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;