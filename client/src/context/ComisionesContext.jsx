import { createContext, useContext, useState } from "react";
import {
  createComisionesRequest,
  getComisionesRequest,
  getComisionRequest,
  deleteComisionesRequest,
  updateComisionesRequest,
} from "../api/comisiones";
import { message } from "antd";

const ComisionContext = createContext();

export const useComisiones = () => {
  const context = useContext(ComisionContext);
  if (!context) {
    throw new Error("useComisiones must be used within a ComisionProvider");
  }
  return context;
};

export default function ComisionesProvider({ children }) {
  // Estado global con la lista de comisiones/cursos
  const [comisiones, setComisiones] = useState([]);

  // Trae todas las comisiones del backend
  const getComisiones = async () => {
    try {
      const res = await getComisionesRequest();
      setComisiones(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Crear una comisión nueva
  const createComision = async (comision) => {
    try {
      const res = await createComisionesRequest(comision);
      console.log("Curso creado:", res.data);
      // Refresco la lista después de crear
      await getComisiones();
      return { ok: true };
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.message || "Error al crear el curso";
      return { ok: false, message: msg };
    }
  };

  // Actualizar una comisión existente
  const updateComision = async (id, comision) => {
    try {
      const res = await updateComisionesRequest(id, comision);
      console.log("Curso actualizado:", res.data);
      // Refresco la lista
      await getComisiones();
      return { ok: true };
    } catch (error) {
      console.log(error);
      const msg =
        error.response?.data?.message || "Error al actualizar el curso";
      return { ok: false, message: msg };
    }
  };

  // Borrar una comisión
  const deleteComision = async (id) => {
    try {
      const res = await deleteComisionesRequest(id);

      if (res.status === 204) {
        // Si el backend confirma borrado, saco el curso del estado
        setComisiones((prev) => prev.filter((c) => c._id !== id));
        message.success("Curso borrado correctamente");
      }
    } catch (error) {
      console.error(error);

      const msg =
        error.response?.data?.message || "No se pudo borrar el curso";

      message.error(msg);
    }
  };

  // Traer una comisión puntual (para la pantalla de edición)
  const getComision = async (id) => {
    try {
      const res = await getComisionRequest(id);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ComisionContext.Provider
      value={{
        comisiones,
        createComision,
        getComisiones,
        deleteComision,
        getComision,
        updateComision,
      }}
    >
      {children}
    </ComisionContext.Provider>
  );
}
