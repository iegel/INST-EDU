import React, { useEffect, useState, useMemo } from "react";
import { useMaterias } from "../context/MateriasContext";
import { Popconfirm, Space, Table, Button, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";

function MateriasPage() {
  const { getMaterias, deleteMateria, materias } = useMaterias();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Actualizo los filtros cuando el usuario escribe
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Aplico filtros en memoria sobre la lista de materias
  const filteredMaterias = useMemo(() => {
    if (!materias) return [];

    return materias.filter((m) => {
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
  }, [materias, filters]);

  // Si todavía no tengo materias, muestro mensaje simple
  if (!materias || materias.length === 0) {
    return (
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Materias</h1>
          <Button
            onClick={() => navigate("/add-materia")}
            className="btn-white-outline"
          >
            Crear materia
          </Button>
        </div>
        <p>No hay materias cargadas.</p>
      </div>
    );
  }

  // Definición de columnas de la tabla
  const columns = [
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
      sorter: (a, b) => a.nombreMateria.localeCompare(b.nombreMateria),
      sortDirections: ["ascend", "descend"],
      render: (text) => <a>{text}</a>,
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
      sorter: (a, b) =>
        (a.comision || "")
          .toString()
          .localeCompare((b.comision || "").toString()),
      sortDirections: ["ascend", "descend"],
    },
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
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Materias</h1>

        <Button
          onClick={() => navigate("/add-materia")}
          className="btn-white-outline"
        >
          Crear materia
        </Button>
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
