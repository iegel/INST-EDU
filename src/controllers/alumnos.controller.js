import Alumno from '../models/alumno.model.js'

export const getAlumnos = async (req,res) =>{
    try {
    const alumnos= await Alumno.find()
    res.json(alumnos)
    } catch (error) {
        return res.status(500).json({message: "Error en obtencion de alumno"})
    }
};

export const createAlumno = async (req,res) =>{
    try{
//        console.log(req.data)
        const {nombre, apellido,dni,comision} = req.body
//        console.log(req.nombre)
        const newAlumno= new Alumno({
        nombre,
        apellido,
        dni,
        comision,
    })
    const savedAlumno = await newAlumno.save()
    res.json(savedAlumno);
    }catch(error){
        console.log(error)
        return res.status(500).json({message: "Error en la creacion"})
    }
};

export const getAlumno = async (req,res) =>{
    try{
        const alumno = await Alumno.findById(req.params.id) //Esto es lo que en la url tiene :id
        if (!alumno) return res.status(404).json({message : "Usuario no encontrado"})
        res.json(alumno)
    }catch(error){
        return res.status(404).json({message: "Usuario no encontrado"})
    }

};

export const updateAlumno = async (req,res) =>{
    try{
        const alumno = await Alumno.findByIdAndUpdate(req.params.id,req.body, {
            new: true
        }) //El new true es para que abajo me devuelva el dato nuevo
        if (!alumno) return res.status(404).json({message : "Usuario no encontrado"})
        res.json(alumno) 
    }catch(error){
        return res.status(404).json({message: "Usuario no encontrado"})        
    }   
};

export const deleteAlumno = async (req,res) =>{
    try{
        const alumno = await Alumno.findByIdAndDelete(req.params.id) //El new true es para que abajo me devuelva el dato nuevo
        if (!alumno) return res.status(404).json({message : "Usuario no encontrado"})
        return res.sendStatus(204)
    }catch(error){
        return res.status(404).json({message: "Usuario no encontrado"})        
    }
};