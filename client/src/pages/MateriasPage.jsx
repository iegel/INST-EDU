import React, { useEffect, useState, useMemo } from "react";
import { useMaterias } from "../context/MateriasContext";
import { useComisiones } from "../context/ComisionesContext";
import { useAuth } from "../context/AuthContext";
import { Popconfirm, Space, Table, Button, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";

// Ordena comisiones "1A", "1B", "2B"..
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

function MateriasPage() {
  const { getMaterias, deleteMateria, materias } = useMaterias();
  const { comisiones, getComisiones } = useComisiones();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  // Estado local para filtros de la tabla
  const [filters, setFilters] = useState({
    nombreMateria: "",
    docente: "",
    comision: "",
  });

  // Al iniciar el componente, traigo la lista de materias
  useEffect(() => {
    getMaterias();

    // El admin ve todas las materias, así que no necesita las comisiones.
    if (!isAdmin) {
      getComisiones();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  // Actualizo los filtros cuando el usuario escribe
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Aplico filtros en memoria sobre la lista de materias.
  // Si el usuario es preceptor, traigo las materias de sus comisiones
  const filteredMaterias = useMemo(() => {
    if (!materias) return [];

    let base = materias;

    // Si NO es admin, traigo las materias de sus comisiones
    if (!isAdmin && user) {
      // Busco las comisiones donde el preceptor es el usuario logueado
      const misCursos = comisiones
        .filter(
          (c) =>
            c.preceptor &&
            // comparo el _id del preceptor con el id del usuario del token
            (c.preceptor._id === user.id || c.preceptor._id === user._id)
        )
        .map((c) => c.numeroComision); // ej: "1A", "2B", etc.

      // Si no tiene cursos asignados, no muestro materias
      if (misCursos.length > 0) {
        base = base.filter((m) => misCursos.includes(m.comision));
      } else {
        base = [];
      }
    }

    // 1) Aplico filtros de texto
    const filtradas = base.filter((m) => {
      const matchNombre = m.nombreMateria
        ?.toLowerCase()
        .includes(filters.nombreMateria.toLowerCase());

      const matchDocente = m.docente
        ?.toString()
        .toLowerCase()
        .includes(filters.docente.toLowerCase());

      const matchComision = (m.comision || "")
        .toString()
        .toLowerCase()
        .includes(filters.comision.toLowerCase());

      return matchNombre && matchDocente && matchComision;
    });

    // 2) Ordeno por comisión (curso) y luego nombre de materia
    return [...filtradas].sort((a, b) => {
      const ca = parseCurso(a.comision);
      const cb = parseCurso(b.comision);

      // Primero por año
      if (ca.anio !== cb.anio) return ca.anio - cb.anio;
      // Luego por letra de curso
      if (ca.letra !== cb.letra) return ca.letra.localeCompare(cb.letra);

      // Y dentro de la misma comisión, por nombre de materia
      const nombreA = (a.nombreMateria || "").toLowerCase();
      const nombreB = (b.nombreMateria || "").toLowerCase();
      return nombreA.localeCompare(nombreB);
    });
  }, [materias, comisiones, filters, isAdmin, user]);

  // Si todavía no tengo materias, muestro mensaje simple
  if (!materias || materias.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Materias</h1>

          {/* Solo el admin puede crear materias */}
          {isAdmin && (
            <Button
              onClick={() => navigate("/add-materia")}
              className="btn-white-outline"
            >
              Crear materia
            </Button>
          )}
        </div>
        <p>No hay materias cargadas.</p>
      </div>
    );
  }

  // Definición de columnas "comunes" de la tabla
  const baseColumns = [
    {
      title: (
        <div>
          <div>Materia</div>
          <Input
            placeholder="Filtrar"
            size="small"
            value={filters.nombreMateria}
            onChange={(e) =>
              handleFilterChange("nombreMateria", e.target.value)
            }
          />
        </div>
      ),
      dataIndex: "nombreMateria",
      key: "nombreMateria",
      sorter: (a, b) =>
        (a.nombreMateria || "").localeCompare(b.nombreMateria || ""),
      sortDirections: ["ascend", "descend"],
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <div>
          <div>Docente</div>
          <Input
            placeholder="Filtrar"
            size="small"
            value={filters.docente}
            onChange={(e) => handleFilterChange("docente", e.target.value)}
          />
        </div>
      ),
      dataIndex: "docente",
      key: "docente",
      sorter: (a, b) =>
        (a.docente || "")
          .toString()
          .localeCompare((b.docente || "").toString()),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <div>
          <div>Comisión</div>
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
      sorter: (a, b) => {
        const ca = parseCurso(a.comision);
        const cb = parseCurso(b.comision);

        if (ca.anio !== cb.anio) return ca.anio - cb.anio;
        return ca.letra.localeCompare(cb.letra);
      },
      sortDirections: ["ascend", "descend"],
    },
  ];

  // Si el usuario es Admin, le agrego la columna de acciones (Editar / Borrar).
  // Si es Preceptor, no ve esta columna.
  const columns = isAdmin
    ? [
        ...baseColumns,
        {
          title: "Acciones",
          key: "action",
          render: (_, record) => (
            <Space size="middle">
              {/* Link al formulario de edición */}
              <Link to={`/materias/${record._id}`}>Editar</Link>

              {/* Confirmación antes de borrar la materia */}
              <Popconfirm
                title="¿Estás seguro de borrar esta materia?"
                okText="Sí"
                cancelText="No"
                okButtonProps={{ type: "primary", danger: true }}
                onConfirm={() => deleteMateria(record._id)}
              >
                <a>Borrar</a>
              </Popconfirm>
            </Space>
          ),
        },
      ]
    : baseColumns;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Materias</h1>

        {/* Solo el admin puede crear materias */}
        {isAdmin && (
          <Button
            onClick={() => navigate("/add-materia")}
            className="btn-white-outline"
          >
            Crear materia
          </Button>
        )}
      </div>

      <Table
        dataSource={filteredMaterias}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />
    </div>
  );
}

export default MateriasPage;
