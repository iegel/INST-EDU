import Materia from '../models/materia.model.js'

// Obtengo todas las materias guardadas en la base
export const getMaterias = async (req, res) => {
    try {
        const materias = await Materia.find()
        res.json(materias)
    } catch (error) {
        // Si algo falla en la consulta, respondo con error 500
        return res.status(500).json({ message: "Error en obtención de materias" })
    }
};


// Creo una nueva materia
export const createMateria = async (req, res) => {
    try {
        // Desestructuro los datos que vienen del formulario del front
        const { nombreMateria, docente, comision } = req.body

        // Armo el objeto como lo espera el modelo de Mongoose
        const newMateria = new Materia({
            nombreMateria,
            docente,
            comision,
        })

        // Guardo en Mongo y devuelvo la materia creada
        const savedMateria = await newMateria.save()
        res.json(savedMateria)

    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Error en la creación de la materia" })
    }
};


// Obtengo una materia en particular según el ID
export const getMateria = async (req, res) => {
    try {
        // Busco por ID que viene como :id en la URL
        const materia = await Materia.findById(req.params.id)

        // Si no existe, devuelvo 404
        if (!materia) return res.status(404).json({ message: "Materia no encontrada" })

        // Si existe, la devuelvo
        res.json(materia)

    } catch (error) {
        return res.status(404).json({ message: "Materia no encontrada" })
    }
};


// Actualizo una materia por ID
export const updateMateria = async (req, res) => {
    try {
        const materia = await Materia.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true, // new:true hace que me devuelva la materia actualizada
            }
        )

        // Si no existe, mando error
        if (!materia) return res.status(404).json({ message: "Materia no encontrada" })

        res.json(materia)

    } catch (error) {
        return res.status(404).json({ message: "Materia no encontrada" })
    }
};


// Elimino una materia por ID
export const deleteMateria = async (req, res) => {
    try {
        const materia = await Materia.findByIdAndDelete(req.params.id)

        if (!materia) return res.status(404).json({ message: "Materia no encontrada" })

        // 204 = borrado exitoso, sin contenido
        return res.sendStatus(204)

    } catch (error) {
        return res.status(404).json({ message: "Materia no encontrada" })
    }
};
