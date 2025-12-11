import React, { useEffect, useState, useMemo } from "react";
import { useAlumnos } from "../context/AlumnosContext";
import { Popconfirm, Space, Table, Input, Button, message, Tag } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { promoteAlumnosRequest } from "../api/alumnos";

// Función para convertir "1A", "2C", etc. en { anio: 1, letra: "A" }
const parseCurso = (value) => {
  if (!value) return { anio: 999, letra: "" };

  const str = value.toString().trim();
  const match = str.match(/^(\d+)\s*([A-Za-z])$/);

  if (!match) return { anio: 999, letra: str.toUpperCase() };

  return {
    anio: parseInt(match[1], 10),
    letra: match[2].toUpperCase(),
  };
};

function AlumnosPage() {
  // Traigo funciones y datos del contexto de alumnos
  const { getAlumnos, deleteAlumno, alumnos } = useAlumnos();

  // Filtros de las columnas
  const [filters, setFilters] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    comision: "",
  });

  // Filas seleccionadas en la tabla (para promoción)
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [promoting, setPromoting] = useState(false); // loading del botón
  const navigate = useNavigate();

  // Al inciar el componente, pido la lista de alumnos al backend
  useEffect(() => {
    getAlumnos();
  }, []);

  // Actualiza el estado de filtros cuando el usuario escribe en los inputs
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Aplico filtros en memoria sobre la lista de alumnos
  const filteredAlumnos = useMemo(() => {
    if (!alumnos) return [];

    const filtrados = alumnos.filter((a) => {
      const matchNombre = a.nombre
        ?.toLowerCase()
        .includes(filters.nombre.toLowerCase());

      const matchApellido = a.apellido
        ?.toLowerCase()
        .includes(filters.apellido.toLowerCase());

      const matchDni = a.dni
        ?.toString()
        .toLowerCase()
        .includes(filters.dni.toLowerCase());

      const matchComision = (a.comision || "")
        .toLowerCase()
        .includes(filters.comision.toLowerCase());

      return matchNombre && matchApellido && matchDni && matchComision;
    });

  return [...filtrados].sort((a, b) => {
    const ca = parseCurso(a.comision);
    const cb = parseCurso(b.comision);

    // Primero ordeno por año
    if (ca.anio !== cb.anio) return ca.anio - cb.anio;

    // Luego ordeno por letra del curso
    if (ca.letra !== cb.letra) return ca.letra.localeCompare(cb.letra);

    // Y dentro del curso ordeno por apellido
    return a.apellido.localeCompare(b.apellido);
  });

  }, [alumnos, filters]);

  // Configuración de selección múltiple de filas
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      // Solo deshabilito el checkbox si el backend indica que NO puede promocionar
      disabled: record.puedePromocionar === false,
    }),
  };

  // Promoción masiva de los alumnos seleccionados
  const handlePromoteSelected = async () => {
    if (selectedRowKeys.length === 0) return;

    try {
      setPromoting(true);

      // Llamo al backend para promocionar todos los IDs seleccionados
      const res = await promoteAlumnosRequest(selectedRowKeys);

      if (res.data?.message) {
        message.info(res.data.message);
      } else {
        message.success("Alumnos procesados para promoción");
      }

      // Refresco la lista porque cambió la comisión / egresado
      await getAlumnos();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message ||
        "Error al promocionar los alumnos seleccionados";
      message.error(msg);
    } finally {
      setPromoting(false);
    }
  };

  // Vista cuando todavía no hay alumnos cargados
  if (!alumnos || alumnos.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Alumnos</h1>
        <p>No hay alumnos cargados.</p>
        <Button
          onClick={() => navigate("/add-alumno")}
          className="btn-white-outline"
        >
          Crear alumno
        </Button>
      </div>
    );
  }

  // Definición de columnas de la tabla
  const columns = [
    {
      // Encabezado con filtro integrado
      title: (
        <div>
          <div>Nombre</div>
          <Input
            placeholder="Filtrar"
            size="small"
            value={filters.nombre}
            onChange={(e) => handleFilterChange("nombre", e.target.value)}
          />
        </div>
      ),
      dataIndex: "nombre",
      key: "nombre",
      sorter: (a, b) => a.nombre.localeCompare(b.nombre),
    },
    {
      title: (
        <div>
          <div>Apellido</div>
          <Input
            placeholder="Filtrar"
            size="small"
            value={filters.apellido}
            onChange={(e) => handleFilterChange("apellido", e.target.value)}
          />
        </div>
      ),
      dataIndex: "apellido",
      key: "apellido",
      sorter: (a, b) => a.apellido.localeCompare(b.apellido),
    },
    {
      title: (
        <div>
          <div>DNI</div>
          <Input
            placeholder="Filtrar"
            size="small"
            value={filters.dni}
            onChange={(e) => handleFilterChange("dni", e.target.value)}
          />
        </div>
      ),
      dataIndex: "dni",
      key: "dni",
      sorter: (a, b) => Number(a.dni) - Number(b.dni),
    },
    {
      title: (
        <div>
          <div>Curso</div>
          <Input
            placeholder="Filtrar"
            size="small"
            value={filters.comision}
            onChange={(e) => handleFilterChange("comision", e.target.value)}
          />
        </div>
      ),
      dataIndex: "comision",
      key: "comision",

      // Ordena 1A,1B,2A,2B
      sorter: (a, b) => {
        const ca = parseCurso(a.comision);
        const cb = parseCurso(b.comision);

        if (ca.anio !== cb.anio) return ca.anio - cb.anio;
        return ca.letra.localeCompare(cb.letra);
      },
    },

    // Promedio del boletín actual (calculado en el backend)
    {
      title: "Promedio boletín",
      dataIndex: "promedio",
      key: "promedio",
      render: (_, record) => {
        if (record.promedio == null) {
          return <Tag>Sin boletín</Tag>;
        }

        const value = Number(record.promedio);
        if (Number.isNaN(value)) return <Tag>Sin boletín</Tag>;

        // Si puede promocionar, muestro el promedio en verde; si no, en rojo
        const color = record.puedePromocionar ? "green" : "red";

        return <Tag color={color}>{value.toFixed(2)}</Tag>;
      },
      sorter: (a, b) =>
        (Number(a.promedio) || 0) - (Number(b.promedio) || 0),
      sortDirections: ["ascend", "descend"],
    },

    // Columna para marcar si el alumno ya egresó
    {
      title: "Egresado",
      dataIndex: "egresado",
      key: "egresado",
      render: (egresado) =>
        egresado ? <Tag color="blue">Egresado</Tag> : null,
      sorter: (a, b) => Number(a.egresado) - Number(b.egresado),
    },

    // Acciones por fila: editar, boletín, borrar
    {
      title: "Acciones",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/alumnos/${record._id}`}>Editar</Link>
          <Link to={`/boletin/${record._id}`}>Ver boletín</Link>
          <Popconfirm
            title="¿Estás seguro de borrar este alumno?"
            okText="Sí"
            cancelText="No"
            onConfirm={() => deleteAlumno(record._id)}
            okButtonProps={{ type: "primary", danger: true }}
          >
            <a>Borrar</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      {/* Título + botones de acciones generales */}
      <div className="flex items-center justify-between mb-4 gap-2">
        <h1 className="text-2xl font-bold">Alumnos</h1>

        <div className="flex gap-2">
          <Button
            onClick={handlePromoteSelected}
            disabled={selectedRowKeys.length === 0}
            loading={promoting}
            className="btn-white-outline"
          >
            Pasar al siguiente año
          </Button>

          <Button
            onClick={() => navigate("/add-alumno")}
            className="btn-white-outline"
          >
            Crear alumno
          </Button>
        </div>
      </div>

      {/* Tabla principal de alumnos */}
      <Table
        dataSource={filteredAlumnos}
        columns={columns}
        rowKey="_id"
        pagination={false}
        rowSelection={rowSelection}
      />
    </div>
  );
}

export default AlumnosPage;
