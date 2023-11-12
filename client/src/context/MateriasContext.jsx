import { createContext, useContext, useState } from "react";
import { createMateriasRequest,getMateriasRequest,getMateriaRequest,deleteMateriasRequest,updateMateriasRequest} from "../api/materias";

import React from 'react'

const MateriaContext = createContext();
export const useMaterias = () => {
    const context = useContext(MateriaContext);
    if (!context){
        throw new Error("useMaterias must be used within a MateriaProvider");
    }

    return context;
}

export default function MateriasProvider({children}) {
    const [materias,setMaterias] = useState([]);
    
    const getMaterias = async () => {
      try{
        const res = await getMateriasRequest();
        setMaterias(res.data)
      }catch(error){
        console.log(error)
      }
    }
    const createMateria = async (materia) =>{
      console.log(materia)
      const res = await createMateriasRequest(materia)
      console.log(res)
    }

    const updateMateria = async (id,materia) =>{
      try {
        const res = await updateMateriasRequest(id,materia)
        console.log(res)       
      } catch (error) {
        console.log(error)
      }
    }

    const deleteMateria = async (id) => {
      try{
        const res = await deleteMateriasRequest(id)
        if (res.status===204) setMaterias(materias.filter((materia)=>materia._id!==id))
      }catch{
        console.log(error);
      }
    }

    const getMateria  = async (id) => {
      try{
        const res = await getMateriaRequest(id);
        return res.data
      }catch(error){
        console.log(error)
      }
    }
  return (
    <MateriaContext.Provider value={{materias,
    createMateria, getMaterias,deleteMateria,getMateria,updateMateria}}>
        {children}
    </MateriaContext.Provider>
  )
}
