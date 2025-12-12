import Materia from '../models/materia.model.js'
import User from '../models/user.model.js'
import Comision from "../models/comision.model.js";

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
    const currentUser = await User.findById(req.user.id);

    if (!currentUser || currentUser.role !== "Admin") {
      return res.status(403).json({
        message: "Solo un administrador puede crear materias",
      });
    }

    const { nombreMateria, docente, comision } = req.body;

    if (!nombreMateria || !docente || !comision) {
      return res.status(400).json({
        message: "Nombre de materia, docente y comisión son obligatorios",
      });
    }

    // Validar que la comisión exista
    const existeComision = await Comision.findOne({
      numeroComision: comision,
    });

    if (!existeComision) {
      return res.status(400).json({
        message: "La comisión indicada no existe",
      });
    }

    const newMateria = new Materia({
      nombreMateria,
      docente,
      comision,
    });

    const savedMateria = await newMateria.save();
    return res.json(savedMateria);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error en la creación de la materia" });
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
    const currentUser = await User.findById(req.user.id);
    if (!currentUser || currentUser.role !== "Admin") {
      return res.status(403).json({
        message: "Solo un administrador puede editar materias",
      });
    }

    const { comision } = req.body;

    // Si quieren cambiar la comisión, valido que exista
    if (comision) {
      const existeComision = await Comision.findOne({
        numeroComision: comision,
      });

      if (!existeComision) {
        return res.status(400).json({
          message: "La comisión indicada no existe",
        });
      }
    }

    const materia = await Materia.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!materia)
      return res.status(404).json({ message: "Materia no encontrada" });

    return res.json(materia);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar la materia" });
  }
};


// Elimino una materia por ID
export const deleteMateria = async (req, res) => {
    try {

        // Valido que el usuario sea Admin
        const currentUser = await User.findById(req.user.id);
        if (!currentUser || currentUser.role !== "Admin") {
        return res.status(403).json({
            message: "Solo un administrador puede borrar materias",
        });
        }

        const materia = await Materia.findByIdAndDelete(req.params.id)

        if (!materia) return res.status(404).json({ message: "Materia no encontrada" })

        // 204 = borrado exitoso, sin contenido
        return res.sendStatus(204)

    } catch (error) {
        return res.status(404).json({ message: "Materia no encontrada" })
    }
};
