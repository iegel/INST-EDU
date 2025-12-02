import Comision from "../models/comision.model.js";
import User from "../models/user.model.js";

// GET /api/comisiones
// Devuelve la lista de todas las comisiones, incluyendo datos básicos del preceptor.
export const getComisiones = async (req, res) => {
  try {
    const comisiones = await Comision.find().populate(
      "preceptor",
      "username email isActive role"
    );
    return res.json(comisiones);
  } catch (error) {
    console.error("Error al obtener comisiones:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener la lista de cursos" });
  }
};

// GET /api/comisiones/:id
// Devuelve una comisión puntual, también con la info del preceptor.
export const getComision = async (req, res) => {
  try {
    const { id } = req.params;
    const comision = await Comision.findById(id).populate(
      "preceptor",
      "username email isActive role"
    );

    if (!comision) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(comision);
  } catch (error) {
    console.error("Error al obtener curso:", error);
    return res
      .status(500)
      .json({ message: "Error al obtener el curso" });
  }
};

// POST /api/comisiones
// Crea una comisión nueva y asocia un preceptor existente.
export const createComision = async (req, res) => {
  try {
    const { numeroComision, anio, curso, preceptor } = req.body;

    // Validamos que el preceptor exista en la colección de usuarios
    const preceptorUser = await User.findById(preceptor);
    if (!preceptorUser) {
      return res.status(400).json({ message: "Preceptor inválido" });
    }

    const nueva = new Comision({
      numeroComision,
      anio,
      curso,
      preceptor: preceptorUser._id,
    });

    const saved = await nueva.save();

    // Volvemos a buscarla con populate para devolver también los datos del preceptor
    const populated = await saved.populate("preceptor", "username email");

    return res.status(201).json(populated);
  } catch (error) {
    console.error("Error al crear curso:", error);
    return res
      .status(500)
      .json({ message: "Error al crear el curso" });
  }
};

// PUT /api/comisiones/:id
// Actualiza los datos de una comisión y opcionalmente cambia el preceptor asignado.
export const updateComision = async (req, res) => {
  try {
    const { id } = req.params;
    const { numeroComision, anio, curso, preceptor } = req.body;

    const updateData = { numeroComision, anio, curso };

    // Si viene un preceptor nuevo, validamos que exista
    if (preceptor) {
      const preceptorUser = await User.findById(preceptor);
      if (!preceptorUser) {
        return res.status(400).json({ message: "Preceptor inválido" });
      }
      updateData.preceptor = preceptorUser._id;
    }

    const updated = await Comision.findByIdAndUpdate(id, updateData, {
      new: true, // devuelve el documento ya actualizado
    }).populate("preceptor", "username email");

    if (!updated) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }

    return res.json(updated);
  } catch (error) {
    console.error("Error al actualizar curso:", error);
    return res
      .status(500)
      .json({ message: "Error al actualizar el curso" });
  }
};

// DELETE /api/comisiones/:id
// Elimina una comisión por id.
export const deleteComision = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Comision.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Curso no encontrado" });
    }
    return res.json({ message: "Curso eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar curso:", error);
    return res
      .status(500)
      .json({ message: "Error al eliminar el curso" });
  }
};