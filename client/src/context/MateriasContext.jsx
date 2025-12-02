import { createContext, useContext, useState } from "react";
import {
  createMateriasRequest,
  getMateriasRequest,
  getMateriaRequest,
  deleteMateriasRequest,
  updateMateriasRequest,
} from "../api/materias";

import React from "react";

const MateriaContext = createContext();

// Custom hook para consumir el contexto
export const useMaterias = () => {
  const context = useContext(MateriaContext);
  if (!context) {
    throw new Error("useMaterias must be used within a MateriaProvider");
  }

  return context;
};

export default function MateriasProvider({ children }) {
  // Estado global con la lista de materias
  const [materias, setMaterias] = useState([]);

  // Traer todas las materias del backend
  const getMaterias = async () => {
    try {
      const res = await getMateriasRequest();
      setMaterias(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Crear materia nueva
  const createMateria = async (materia) => {
    try {
      const res = await createMateriasRequest(materia);
      console.log(res);
      // Podrías llamar a getMaterias() para refrescar la lista si querés
    } catch (error) {
      console.log(error);
    }
  };

  // Actualizar una materia existente
  const updateMateria = async (id, materia) => {
    try {
      const res = await updateMateriasRequest(id, materia);
      console.log(res);
      // También se podría refrescar el listado si es necesario
    } catch (error) {
      console.log(error);
    }
  };

  // Borrar materia
  const deleteMateria = async (id) => {
    try {
      const res = await deleteMateriasRequest(id);
      if (res.status === 204) {
        // Si el backend confirma borrado, la saco de la lista local
        setMaterias(materias.filter((materia) => materia._id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Traer una materia puntual (para editar)
  const getMateria = async (id) => {
    try {
      const res = await getMateriaRequest(id);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MateriaContext.Provider
      value={{
        materias,
        createMateria,
        getMaterias,
        deleteMateria,
        getMateria,
        updateMateria,
      }}
    >
      {children}
    </MateriaContext.Provider>
  );
}
