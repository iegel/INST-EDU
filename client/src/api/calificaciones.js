import axios from "./axios";

// Obtiene boletín del alumno
export const getBoletinByAlumnoRequest = (alumnoId, cicloKey) => {
  if (cicloKey) {
    const [year, comision] = cicloKey.split("|")
    const params = new URLSearchParams()
    if (year) params.append("year", year)
    if (comision) params.append("comision", comision)
    return axios.get(`/boletin/${alumnoId}?${params.toString()}`)
  }

  // Si no se pasa ciclo → backend devuelve el actual o el último cargado
  return axios.get(`/boletin/${alumnoId}`)
}

// Guarda boletín (POST /boletin/:id)
export const saveBoletinAlumnoRequest = (
  alumnoId,
  calificaciones,
  cicloLectivo,
  comision
) => {
  return axios.post(`/boletin/${alumnoId}`, {
    cicloLectivo,
    comision,
    calificaciones,
  })
}
