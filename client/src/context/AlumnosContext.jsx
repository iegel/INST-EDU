import { createContext, useContext, useState } from "react";
import { createAlumnosRequest,getAlumnosRequest,getAlumnoRequest,deleteAlumnosRequest,updateAlumnosRequest} from "../api/alumnos";

import React from 'react'

const AlumnoContext = createContext();
export const useAlumnos = () => {
    const context = useContext(AlumnoContext);
    if (!context){
        throw new Error("useAlumnos must be used within a AlumnosProvider");
    }

    return context;
}

export default function AlumnosProvider({children}) {
    const [alumnos,setAlumnos] = useState([]);
    
    const getAlumnos = async () => {
      try{
        const res = await getAlumnosRequest();
        setAlumnos(res.data)
      }catch(error){
        console.log(error)
      }
    }
    const createAlumno = async (alumno) =>{
      console.log(alumno)
      const res = await createAlumnosRequest(alumno)
      console.log(res)
    }

    const updateAlumno = async (id,alumno) =>{
      try {
        const res = await updateAlumnosRequest(id,alumno)
        console.log(res)       
      } catch (error) {
        console.log(error)
      }
    }

    const deleteAlumno = async (id) => {
      try{
        const res = await deleteAlumnosRequest(id)
        if (res.status===204) setAlumnos(alumnos.filter((alumno)=>alumno._id!==id))
      }catch{
        console.log(error);
      }
    }

    const getAlumno  = async (id) => {
      try{
        const res = await getAlumnoRequest(id);
        return res.data
      }catch(error){
        console.log(error)
      }
    }
  return (
    <AlumnoContext.Provider value={{alumnos,
    createAlumno, getAlumnos,deleteAlumno,getAlumno,updateAlumno}}>
        {children}
    </AlumnoContext.Provider>
  )
}
