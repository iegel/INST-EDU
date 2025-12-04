import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Table, InputNumber, Button, Tag, message, Select } from "antd";
import {
  getBoletinByAlumnoRequest,
  saveBoletinAlumnoRequest,
} from "../api/calificaciones";

const { Option } = Select;

// Funcion para calcular promedio, habilitación de diciembre/marzo/previa
// y la nota final de una fila (una materia).
function calcularEstadoFila(notas) {
  const t1 = typeof notas[1] === "number" ? notas[1] : null;
  const t2 = typeof notas[2] === "number" ? notas[2] : null;
  const t3 = typeof notas[3] === "number" ? notas[3] : null;
  const diciembre =
    typeof notas.diciembre === "number" ? notas.diciembre : null;
  const marzo = typeof notas.marzo === "number" ? notas.marzo : null;
  const previa = typeof notas.previa === "number" ? notas.previa : null;

  let promedio = null;

  // Promedio solo si están los 3 trimestres
  if (t1 !== null && t2 !== null && t3 !== null) {
    promedio = (t1 + t2 + t3) / 3;
  }

  let dicHabilitado = false;
  let marHabilitado = false;
  let prevHabilitado = false;

  // Habilito diciembre si el promedio de los 3 trimestres es menor a 6
  if (promedio !== null && promedio < 6) {
    dicHabilitado = true;
  }

  // Habilito marzo si diciembre está cargado y es menor a 6
  if (diciembre !== null && diciembre < 6) {
    marHabilitado = true;
  }

  // Habilito previa si marzo está cargado y es menor a 6
  if (marzo !== null && marzo < 6) {
    prevHabilitado = true;
  }

  // Nota final según la última instancia aprobada
  let notaFinal = null;

  if (promedio !== null && promedio >= 6) {
    notaFinal = promedio;
  } else if (diciembre !== null && diciembre >= 6) {
    notaFinal = diciembre;
  } else if (marzo !== null && marzo >= 6) {
    notaFinal = marzo;
  } else if (previa !== null && previa >= 6) {
    notaFinal = previa;
  } else {
    // Si ninguna llega a 6, uso la última nota disponible
    if (previa !== null) notaFinal = previa;
    else if (marzo !== null) notaFinal = marzo;
    else if (diciembre !== null) notaFinal = diciembre;
    else if (promedio !== null) notaFinal = promedio;
    else notaFinal = null;
  }

  return {
    promedio,
    dicHabilitado,
    marHabilitado,
    prevHabilitado,
    notaFinal,
  };
}

function BoletinPage() {
  const { id } = useParams(); // id del alumno en la URL
  const navigate = useNavigate();

  const [alumno, setAlumno] = useState(null);
  const [rows, setRows] = useState([]); // filas de la tabla: una por materia
  const [loading, setLoading] = useState(true);

  // Ciclos lectivos / boletines disponibles para ese alumno
  const [ciclosDisponibles, setCiclosDisponibles] = useState([]);
  const [selectedCiclo, setSelectedCiclo] = useState(null); // "2024|3A" por ejemplo
  const [anio, setAnio] = useState(null); // año del ciclo lectivo actual del formulario
  const [comisionCiclo, setComisionCiclo] = useState(null); // comisión del ciclo seleccionado

  const esEgresado = alumno?.egresado;

  // Carga inicial del boletín y recarga cuando se cambia de ciclo seleccionado
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Pido al backend el boletín del alumno.
        // Si selectedCiclo es null, el backend devuelve el "boletín actual".
        const res = await getBoletinByAlumnoRequest(id, selectedCiclo);
        const data = res.data || {};

        const a = data.alumno;
        const materias = data.materias || [];
        const calificaciones = data.calificaciones || [];
        const ciclos = data.ciclosDisponibles || [];
        const cicloLectivo = data.cicloLectivo;
        const comision = data.comision;

        if (!a) {
          message.error("Alumno no encontrado");
          setLoading(false);
          navigate("/alumnos");
          return;
        }

        setAlumno(a);
        setCiclosDisponibles(ciclos);

        // Propuesta de año (ciclo lectivo) para el formulario
        if (!anio) {
          let nuevoAnio = null;

          if (cicloLectivo) {
            // Si el backend ya está mostrando un boletín concreto, uso ese año
            nuevoAnio = cicloLectivo;
          } else if (ciclos.length > 0) {
            // Si tiene boletines anteriores, tomo el último ciclo lectivo
            const maxYear = Math.max(
              ...ciclos.map((c) => c.cicloLectivo || 0)
            );
            // Si está egresado → último año; si no, sugiero el año siguiente
            nuevoAnio = a.egresado ? maxYear : maxYear + 1;
          } else {
            // Nunca tuvo boletín: uso el año actual salvo que sea egresado
            nuevoAnio = a.egresado ? null : new Date().getFullYear();
          }

          if (nuevoAnio) {
            setAnio(nuevoAnio);
          }
        }

        // Comision del ciclo actual (la que viene del backend la primera vez)
        if (comision && !comisionCiclo) {
          setComisionCiclo(comision);
        }

        // Clave que identifica un boletín "año|comisión"
        const backendKey =
          cicloLectivo && comision ? `${cicloLectivo}|${comision}` : null;

        // Si no había nada seleccionado, me quedo con lo que definió el backend
        setSelectedCiclo((prev) => (prev ? prev : backendKey));

        // Mapa auxiliar para ubicar notas por materia+trimestre
        const mapCalif = {};
        calificaciones.forEach((c) => {
          if (c.materia && c.materia._id) {
            const key = `${c.materia._id}-${c.trimestre}`;
            mapCalif[key] = c;
          }
        });

        // Armo las filas de la tabla: una por materia con todas sus notas
        const filas = materias.map((m) => ({
          materiaId: m._id,
          nombreMateria: m.nombreMateria,
          notas: {
            1: mapCalif[`${m._id}-1`]?.nota ?? null,
            2: mapCalif[`${m._id}-2`]?.nota ?? null,
            3: mapCalif[`${m._id}-3`]?.nota ?? null,
            diciembre: mapCalif[`${m._id}-4`]?.nota ?? null,
            marzo: mapCalif[`${m._id}-5`]?.nota ?? null,
            previa: mapCalif[`${m._id}-6`]?.nota ?? null,
          },
        }));

        setRows(filas);
      } catch (error) {
        console.error(error);
        message.error("Error al cargar el boletín");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [id, navigate, selectedCiclo, anio, comisionCiclo]);

  // Actualiza una nota de una materia en un campo específico (t1, t2, dic, etc.)
  const handleNotaChange = (materiaId, campo, value) => {
    const nota = typeof value === "number" ? value : null;

    setRows((prev) =>
      prev.map((row) =>
        row.materiaId === materiaId
          ? {
            ...row,
            notas: {
              ...row.notas,
              [campo]: nota,
            },
          }
          : row
      )
    );
  };

  // Muestra el promedio de una fila (materia)
  const promedioFila = (record) => {
    const { promedio } = calcularEstadoFila(record.notas);
    if (promedio === null) return "-";
    return promedio.toFixed(2);
  };

  // Promedio general del boletín, calculado en base a las notas finales de cada materia
  const promedioGeneral = useMemo(() => {
    if (!rows.length) return null;

    const estados = rows.map((r) => calcularEstadoFila(r.notas));
    const notasFinales = estados
      .map((e) => e.notaFinal)
      .filter((n) => typeof n === "number");

    // Si ninguna materia tiene nota final, no muestro promedio
    if (notasFinales.length === 0) {
      return null;
    }

    const suma = notasFinales.reduce((acc, n) => acc + n, 0);
    return Number((suma / notasFinales.length).toFixed(2));
  }, [rows]);

  // Columnas de la tabla de boletín
  const columns = [
    {
      title: "Materia",
      dataIndex: "nombreMateria",
      key: "nombreMateria",
    },
    {
      title: "1° Trimestre",
      key: "t1",
      render: (_, record) =>
        esEgresado ? (
          record.notas[1] ?? "-"
        ) : (
          <InputNumber
            min={1}
            max={10}
            value={record.notas[1]}
            onChange={(value) => handleNotaChange(record.materiaId, 1, value)}
          />
        ),
    },
    {
      title: "2° Trimestre",
      key: "t2",
      render: (_, record) =>
        esEgresado ? (
          record.notas[2] ?? "-"
        ) : (
          <InputNumber
            min={1}
            max={10}
            value={record.notas[2]}
            onChange={(value) => handleNotaChange(record.materiaId, 2, value)}
          />
        ),
    },
    {
      title: "3° Trimestre",
      key: "t3",
      render: (_, record) =>
        esEgresado ? (
          record.notas[3] ?? "-"
        ) : (
          <InputNumber
            min={1}
            max={10}
            value={record.notas[3]}
            onChange={(value) => handleNotaChange(record.materiaId, 3, value)}
          />
        ),
    },
    {
      title: "Promedio",
      key: "promedio",
      render: (_, record) => promedioFila(record),
    },
    {
      title: "Dic.",
      key: "dic",
      render: (_, record) => {
        const estado = calcularEstadoFila(record.notas);
        return esEgresado ? (
          record.notas.diciembre ?? "-"
        ) : (
          <InputNumber
            min={1}
            max={10}
            value={record.notas.diciembre}
            disabled={!estado.dicHabilitado}
            onChange={(value) =>
              handleNotaChange(record.materiaId, "diciembre", value)
            }
          />
        );
      },
    },
    {
      title: "Marzo",
      key: "marzo",
      render: (_, record) => {
        const estado = calcularEstadoFila(record.notas);
        return esEgresado ? (
          record.notas.marzo ?? "-"
        ) : (
          <InputNumber
            min={1}
            max={10}
            value={record.notas.marzo}
            disabled={!estado.marHabilitado}
            onChange={(value) =>
              handleNotaChange(record.materiaId, "marzo", value)
            }
          />
        );
      },
    },
    {
      title: "Previa",
      key: "previa",
      render: (_, record) => {
        const estado = calcularEstadoFila(record.notas);
        return esEgresado ? (
          record.notas.previa ?? "-"
        ) : (
          <InputNumber
            min={1}
            max={10}
            value={record.notas.previa}
            disabled={!estado.prevHabilitado}
            onChange={(value) =>
              handleNotaChange(record.materiaId, "previa", value)
            }
          />
        );
      },
    },
  ];

  // Guarda el boletín actual llamando al backend
  const handleGuardar = async () => {
    if (esEgresado) {
      message.error(
        "El alumno está egresado. Solo se pueden consultar boletines anteriores."
      );
      return;
    }

    try {
      const comisionSeleccionada = comisionCiclo || alumno?.comision || null;

      if (!anio || !comisionSeleccionada) {
        message.error(
          "Debe ingresar un año de ciclo lectivo y tener una comisión válida."
        );
        return;
      }

      const cicloLectivo = Number(anio);
      const datos = [];

      // Recorro cada fila y armo los documentos que el backend espera
      rows.forEach((row) => {
        // Trimestres
        [1, 2, 3].forEach((t) => {
          const nota = row.notas[t];
          if (typeof nota === "number") {
            datos.push({
              materiaId: row.materiaId,
              trimestre: t,
              nota,
              observaciones: "",
            });
          }
        });

        // Instancias especiales
        if (typeof row.notas.diciembre === "number") {
          datos.push({
            materiaId: row.materiaId,
            trimestre: 4,
            nota: row.notas.diciembre,
            observaciones: "Diciembre",
          });
        }

        if (typeof row.notas.marzo === "number") {
          datos.push({
            materiaId: row.materiaId,
            trimestre: 5,
            nota: row.notas.marzo,
            observaciones: "Marzo",
          });
        }

        if (typeof row.notas.previa === "number") {
          datos.push({
            materiaId: row.materiaId,
            trimestre: 6,
            nota: row.notas.previa,
            observaciones: "Previa",
          });
        }
      });

      // Llamo al endpoint que guarda el boletín completo del ciclo
      await saveBoletinAlumnoRequest(
        id,
        datos,
        cicloLectivo,
        comisionSeleccionada
      );

      // Actualizo el ciclo seleccionado al que acabo de guardar
      const newKey = `${cicloLectivo}|${comisionSeleccionada}`;
      setSelectedCiclo(newKey);

      message.success("Boletín guardado correctamente");
    } catch (error) {
      console.error(error);
      message.error(
        error.response?.data?.message || "Error al guardar el boletín"
      );
    }
  };

  // Cuando elijo otro año/comisión del combo de "boletines cargados"
  const handleSelectCiclo = (val) => {
    setSelectedCiclo(val);
    if (val) {
      const [yearStr, comisionSel] = val.split("|");
      setAnio(Number(yearStr));
      setComisionCiclo(comisionSel);
    } else {
      setAnio(null);
      setComisionCiclo(null);
    }
  };

  // Vuelve al “boletín actual” (el que decide el backend)
  const handleVolverBoletinActual = () => {
    setSelectedCiclo(null);
    setAnio(null);
    setComisionCiclo(null);
  };

  if (loading) return <div className="p-4">Cargando boletín...</div>;

  return (
    <div className="p-4">
      {/* Header: título + selector de ciclos + botones */}
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-2xl font-bold">Boletín del Alumno</h1>
        <div className="flex gap-3 items-center">
          <span>Boletines cargados:</span>
          <Select
            style={{ width: 220 }}
            value={selectedCiclo}
            onChange={handleSelectCiclo}
            placeholder="Seleccione un boletín"
            allowClear
          >
            {ciclosDisponibles.map((c) => {
              const key = `${c.cicloLectivo}|${c.comision}`;
              return (
                <Option key={key} value={key}>
                  {`${c.cicloLectivo} - ${c.comision}`}
                </Option>
              );
            })}
          </Select>

          <Button onClick={handleVolverBoletinActual} className="btn-white-outline">
            Boletín actual
          </Button>

          <Button
            onClick={() => navigate("/alumnos")}
            className="btn-white-outline"
          >
            ← Volver a alumnos
          </Button>
        </div>
      </div>

      {/* Panel con datos del alumno y promedio general */}
      <div className="bg-white p-4 rounded shadow mb-4 text-black">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <p>
              <strong>Alumno:</strong>{" "}
              {alumno ? `${alumno.nombre} ${alumno.apellido}` : "-"}
            </p>
            <p>
              <strong>DNI:</strong> {alumno?.dni || "-"}
            </p>
            <p>
              <strong>Curso actual:</strong> {alumno?.comision || "-"}
            </p>
            <p className="mt-2">
              <strong>Promedio general: </strong>
              {promedioGeneral !== null ? (
                <Tag color={promedioGeneral >= 6 ? "green" : "red"}>
                  {promedioGeneral.toFixed(2)}
                </Tag>
              ) : (
                <Tag>Sin calificaciones</Tag>
              )}
            </p>
            {esEgresado && (
              <p className="mt-2 text-red-500 text-sm">
                Alumno egresado: solo se pueden consultar boletines anteriores.
              </p>
            )}
          </div>

          {/* Año (ciclo lectivo) editable */}
          <div className="flex flex-col items-start">
            <span className="mb-1 font-semibold">
              Año (ciclo lectivo) <span className="text-red-500">*</span>
            </span>
            <InputNumber
              min={2000}
              max={2100}
              value={anio}
              onChange={(val) => setAnio(val)}
              disabled={esEgresado}
            />
            <span className="text-xs text-gray-500 mt-1">
              Ejemplo: 2023, 2024, etc.
            </span>
          </div>
        </div>
      </div>

      {/* Tabla de materias y notas */}
      <Table
        dataSource={rows}
        columns={columns}
        rowKey="materiaId"
        pagination={false}
      />

      {/* Botón para guardar el boletín completo */}
      <div className="mt-4">
        <Button
          type="primary"
          onClick={handleGuardar}
          disabled={esEgresado}
        >
          Guardar boletín
        </Button>
      </div>
    </div>
  );
}

export default BoletinPage;
