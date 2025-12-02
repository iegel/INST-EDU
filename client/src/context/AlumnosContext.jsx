import { createContext, useContext, useState } from "react";
import {
  createAlumnosRequest,
  getAlumnosRequest,
  getAlumnoRequest,
  deleteAlumnosRequest,
  updateAlumnosRequest,
} from "../api/alumnos";

import React from "react";

const AlumnoContext = createContext();

// Custom hook para usar el contexto de alumnos desde cualquier componente
export const useAlumnos = () => {
  const context = useContext(AlumnoContext);
  if (!context) {
    throw new Error("useAlumnos must be used within a AlumnosProvider");
  }

  return context;
};

export default function AlumnosProvider({ children }) {
  // Estado global con la lista de alumnos que se muestra en las tablas
  const [alumnos, setAlumnos] = useState([]);

  // Trae la lista completa de alumnos desde el backend
  const getAlumnos = async () => {
    try {
      const res = await getAlumnosRequest();
      setAlumnos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Crea un alumno nuevo llamando al backend
  const createAlumno = async (alumno) => {
    console.log(alumno);
    const res = await createAlumnosRequest(alumno);
    console.log(res);
    // Podría actualizar la lista o redirigir después desde el formulario
  };

  // Actualiza un alumno existente
  const updateAlumno = async (id, alumno) => {
    try {
      const res = await updateAlumnosRequest(id, alumno);
      console.log(res);
      // Igual que arriba, podría refrescar la lista si lo necesito
    } catch (error) {
      console.log(error);
    }
  };

  // Borra un alumno por id y actualiza el estado local
  const deleteAlumno = async (id) => {
    try {
      const res = await deleteAlumnosRequest(id);
      if (res.status === 204) {
        // Si el backend confirma borrado, saco el alumno del estado
        setAlumnos(alumnos.filter((alumno) => alumno._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Trae un alumno puntual (para la pantalla de edición, por ejemplo)
  const getAlumno = async (id) => {
    try {
      const res = await getAlumnoRequest(id);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AlumnoContext.Provider
      value={{
        alumnos,
        createAlumno,
        getAlumnos,
        deleteAlumno,
        getAlumno,
        updateAlumno,
      }}
    >
      {children}
    </AlumnoContext.Provider>
  );
}
