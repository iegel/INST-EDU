import React, { useEffect, useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Space, Popconfirm, Button, Input } from "antd";
import { useComisiones } from "../context/ComisionesContext";

function ComisionesPage() {
  const { comisiones, getComisiones, deleteComision } = useComisiones();
  const navigate = useNavigate();

  // Filtros para las columnas de la tabla
  const [filters, setFilters] = useState({
    anio: "",
    curso: "",
    preceptor: "",
  });

  // Al iniciar el componente, traigo la lista de cursos/comisiones
  useEffect(() => {
    getComisiones();
  }, []);

  // Actualiza el filtro cuando el usuario escribe en los inputs
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Aplico filtros en memoria sobre las comisiones que viene del contexto
  const filteredComisiones = useMemo(() => {
    if (!comisiones) return [];

    return comisiones.filter((c) => {
      const anioStr = c.anio?.toString() ?? "";
      const cursoStr = c.curso?.toString() ?? "";
      const preceptorStr = c.preceptor
        ? `${c.preceptor.username} (${c.preceptor.email})`
        : "";

      const matchAnio = anioStr
        .toLowerCase()
        .includes(filters.anio.toLowerCase());

      const matchCurso = cursoStr
        .toLowerCase()
        .includes(filters.curso.toLowerCase());

      const matchPreceptor = preceptorStr
        .toLowerCase()
        .includes(filters.preceptor.toLowerCase());

      return matchAnio && matchCurso && matchPreceptor;
    });
  }, [comisiones, filters]);

  const columns = [
    {
      title: (
        <div>
          <div>Año</div>
          <Input
            placeholder="Filtrar"
            size="small"
            value={filters.anio}
            onChange={(e) => handleFilterChange("anio", e.target.value)}
          />
        </div>
      ),
      dataIndex: "anio",
      key: "anio",
      sorter: (a, b) => a.anio - b.anio,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <div>
          <div>Curso</div>
          <Input
            placeholder="Filtrar"
            size="small"
            value={filters.curso}
            onChange={(e) => handleFilterChange("curso", e.target.value)}
          />
        </div>
      ),
      key: "curso",
      render: (_, record) => (
        <span>{`${record.anio}° año - Curso ${record.curso}`}</span>
      ),
      sorter: (a, b) =>
        `${a.anio}° año - Curso ${a.curso}`
          .toString()
          .localeCompare(`${b.anio}° año - Curso ${b.curso}`.toString()),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <div>
          <div>Preceptor</div>
          <Input
            placeholder="Filtrar"
            size="small"
            value={filters.preceptor}
            onChange={(e) => handleFilterChange("preceptor", e.target.value)}
          />
        </div>
      ),
      dataIndex: "preceptor",
      key: "preceptor",
      render: (preceptor) =>
        preceptor ? `${preceptor.username} (${preceptor.email})` : "-",
      sorter: (a, b) => {
        const aStr = a.preceptor
          ? `${a.preceptor.username} (${a.preceptor.email})`
          : "";
        const bStr = b.preceptor
          ? `${b.preceptor.username} (${b.preceptor.email})`
          : "";
        return aStr.localeCompare(bStr);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Acciones",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* Editar comisión */}
          <Link to={`/comisiones/${record._id}`}>Editar</Link>
          {/* Confirmación antes de borrar */}
          <Popconfirm
            title="¿Estás seguro de borrar este curso?"
            okText="Sí"
            cancelText="No"
            okButtonProps={{ type: "primary", danger: true }}
            onConfirm={() => deleteComision(record._id)}
          >
            <a>Borrar</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // Si no hay comisiones todavía, muestro un mensaje simple
  if (!comisiones || comisiones.length === 0) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Cursos</h1>
        <p>No hay cursos cargados.</p>
        <Button
          onClick={() => navigate("/add-comision")}
          className="btn-white-outline"
        >
          Crear curso
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Cursos</h1>
        <Button
          onClick={() => navigate("/add-comision")}
          className="btn-white-outline"
        >
          Crear curso
        </Button>
      </div>

      <Table
        dataSource={filteredComisiones}
        columns={columns}
        rowKey="_id"
        pagination={false}
      />
    </div>
  );
}

export default ComisionesPage;
