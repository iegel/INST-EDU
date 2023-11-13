import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import AlumnosPage from "./pages/AlumnosPage";
import AlumnoFormPage from "./pages/AlumnosFormPage";
import ProtectedRoute from "./ProtectedRoute";
import AlumnoProvider from "./context/AlumnosContext";
import MateriasPage from "./pages/MateriasPage";
import MateriaFormPage from "./pages/MateriasFormPage";
import MateriaProvider from "./context/MateriasContext";
import ComisionesPage from "./pages/ComisionesPage";
import ComisionFormPage from "./pages/ComisionesFormPage";
import ComisionProvider from "./context/ComisionesContext";
import Navbar from "./components/Navbar";
import UsuariosFormPage from "./pages/UsuariosFormPage";
import { ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';
import ProtectedRouteAdmin from "./ProtectedRouteAdmin";

//test
function App() {
  return (
    <AuthProvider>
      <AlumnoProvider>
        <MateriaProvider>
          <ComisionProvider>
            <BrowserRouter >
              <main className="container mx-auto px-10">
                <Navbar />
                <Routes>
                  <Route path='/' element={<LoginPage />} />
                  <Route element={<ProtectedRoute />}>
                    <Route path='/alumnos' element={<AlumnosPage />} />
                    <Route path='/add-alumno' element={<AlumnoFormPage />} />
                    <Route path='/alumnos/:id' element={<AlumnoFormPage />} />
                    <Route path='/materias' element={<MateriasPage />} />
                    <Route path='/add-materia' element={<MateriaFormPage />} />
                    <Route path='/materias/:id' element={<MateriaFormPage />} />
                    <Route path='/comisiones' element={<ComisionesPage />} />
                    <Route path='/add-comision' element={<ComisionFormPage />} />
                    <Route path='/comisiones/:id' element={<ComisionFormPage />} />
                    <Route element={<ProtectedRouteAdmin />}>
                      <Route path='/add-usuario' element={<UsuariosFormPage />} />
                    </Route>
                  </Route>
                </Routes>
              </main>
            </BrowserRouter>
          </ComisionProvider>
        </MateriaProvider>
      </AlumnoProvider>
    </AuthProvider>
  )
}

export default App;