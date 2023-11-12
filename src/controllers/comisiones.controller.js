import Comision from '../models/comision.model.js'

export const getComisiones = async (req,res) =>{
    try {
    const comisiones= await Comision.find()
    res.json(comisiones)
    } catch (error) {
        return res.status(500).json({message: "Error en obtencion de comision"})
    }
};

export const createComision = async (req,res) =>{
    try{
//        console.log(req.data)
        const {numeroComision, preceptor} = req.body
//        console.log(req.nombre)
        const newComision= new Comision({
        numeroComision,
        preceptor,
    })
    const savedComision = await newComision.save()
    res.json(savedComision);
    }catch(error){
        console.log(error)
        return res.status(500).json({message: "Error en la creacion"})
    }
};

export const getComision = async (req,res) =>{
    try{
        const comision = await Comision.findById(req.params.id) //Esto es lo que en la url tiene :id
        if (!comision) return res.status(404).json({message : "Comision no encontrada"})
        res.json(comision)
    }catch(error){
        return res.status(404).json({message: "Comision no encontrada"})
    }

};

export const updateComision = async (req,res) =>{
    try{
        const comision = await Comision.findByIdAndUpdate(req.params.id,req.body, {
            new: true
        }) //El new true es para que abajo me devuelva el dato nuevo
        if (!comision) return res.status(404).json({message : "Comision no encontrada"})
        res.json(comision) 
    }catch(error){
        return res.status(404).json({message: "Comision no encontrada"})        
    }   
};

export const deleteComision = async (req,res) =>{
    try{
        const comision = await Comision.findByIdAndDelete(req.params.id) //El new true es para que abajo me devuelva el dato nuevo
        if (!comision) return res.status(404).json({message : "Comision no encontrada"})
        return res.sendStatus(204)
    }catch(error){
        return res.status(404).json({message: "Comision no encontrada"})        
    }
};