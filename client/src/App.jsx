import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import AlumnosPage from "./pages/AlumnosPage";
import AlumnoFormPage from "./pages/AlumnosFormPage";
import PotectedRoute from "./PotectedRoute";
import AlumnoProvider from "./context/AlumnosContext";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <AlumnoProvider>
        <BrowserRouter >
          <main className="container mx-auto px-10">
            <Navbar />
            <Routes>
              <Route path='/' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route element={<PotectedRoute />}>
                <Route path='/alumnos' element={<AlumnosPage />} />
                <Route path='/add-alumno' element={<AlumnoFormPage />} />
                <Route path='/alumnos/:id' element={<AlumnoFormPage />} />
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </AlumnoProvider>
    </AuthProvider>
  )
}

export default App;