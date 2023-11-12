import Materia from '../models/materia.model.js'

export const getMaterias = async (req,res) =>{
    try {
    const materias= await Materia.find()
    res.json(materias)
    } catch (error) {
        return res.status(500).json({message: "Error en obtencion de materia"})
    }
};

export const createMateria = async (req,res) =>{
    try{
//        console.log(req.data)
        const {nombreMateria, docente,comision} = req.body
//        console.log(req.nombre)
        const newMateria= new Materia({
        nombreMateria,
        docente,
        comision,
    })
    const savedMateria = await newMateria.save()
    res.json(savedMateria);
    }catch(error){
        console.log(error)
        return res.status(500).json({message: "Error en la creacion"})
    }
};

export const getMateria = async (req,res) =>{
    try{
        const materia = await Materia.findById(req.params.id) //Esto es lo que en la url tiene :id
        if (!materia) return res.status(404).json({message : "Materia no encontrada"})
        res.json(materia)
    }catch(error){
        return res.status(404).json({message: "Materia no encontrada"})
    }

};

export const updateMateria = async (req,res) =>{
    try{
        const materia = await Materia.findByIdAndUpdate(req.params.id,req.body, {
            new: true
        }) //El new true es para que abajo me devuelva el dato nuevo
        if (!materia) return res.status(404).json({message : "Materia no encontrada"})
        res.json(materia) 
    }catch(error){
        return res.status(404).json({message: "Materia no encontrada"})        
    }   
};

export const deleteMateria = async (req,res) =>{
    try{
        const materia = await Mmteria.findByIdAndDelete(req.params.id) //El new true es para que abajo me devuelva el dato nuevo
        if (!materia) return res.status(404).json({message : "Materia no encontrada"})
        return res.sendStatus(204)
    }catch(error){
        return res.status(404).json({message: "Materia no encontrada"})        
    }
};