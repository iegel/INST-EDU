import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// Contextos globales de la app
import { AuthProvider } from "./context/AuthContext.jsx";
import AlumnosProvider from "./context/AlumnosContext.jsx";
import ComisionesProvider from "./context/ComisionesContext.jsx";
import MateriasProvider from "./context/MateriasContext.jsx";

// Punto de entrada de React.
// Acá monto la aplicación dentro del div #root del index.html.
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Habilito el router de React */}
    <BrowserRouter>
      {/* Contexto de autenticación: guarda usuario logueado y rol */}
      <AuthProvider>
        {/* Contexto de comisiones disponible en toda la app */}
        <ComisionesProvider>
          {/* Contexto de materias */}
          <MateriasProvider>
            {/* Contexto de alumnos */}
            <AlumnosProvider>
              {/* Componente principal donde defino las rutas */}
              <App />
            </AlumnosProvider>
          </MateriasProvider>
        </ComisionesProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);