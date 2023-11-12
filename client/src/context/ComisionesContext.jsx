import { createContext, useContext, useState } from "react";
import { createComisionesRequest,getComisionesRequest,getComisionRequest,deleteComisionesRequest,updateComisionesRequest} from "../api/comisiones";

import React from 'react'

const ComisionContext = createContext();
export const useComisiones = () => {
    const context = useContext(ComisionContext);
    if (!context){
        throw new Error("useComisiones must be used within a ComisionProvider");
    }

    return context;
}

export default function ComisionesProvider({children}) {
    const [comisiones,setComisiones] = useState([]);
    
    const getComisiones = async () => {
      try{
        const res = await getComisionesRequest();
        setComisiones(res.data)
      }catch(error){
        console.log(error)
      }
    }
    const createComision = async (comision) =>{
      console.log(comision)
      const res = await createComisionesRequest(comision)
      console.log(res)
    }

    const updateComision = async (id,comision) =>{
      try {
        const res = await updateComisionesRequest(id,comision)
        console.log(res)       
      } catch (error) {
        console.log(error)
      }
    }

    const deleteComision = async (id) => {
      try{
        const res = await deleteComisionesRequest(id)
        if (res.status===204) setComisiones(comisiones.filter((comision)=>comision._id!==id))
      }catch{
        console.log(error);
      }
    }

    const getComision = async (id) => {
      try{
        const res = await getComisionRequest(id);
        return res.data
      }catch(error){
        console.log(error)
      }
    }
  return (
    <ComisionContext.Provider value={{comisiones,
    createComision, getComisiones,deleteComision,getComision,updateComision}}>
        {children}
    </ComisionContext.Provider>
  )
}
