import { useEffect, useState, useMemo } from "react";
import { Table, Tag, Button, Popconfirm, Space, message, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  getUsersRequest,
  updateUserRequest,
  deleteUserRequest,
} from "../api/auth";

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Filtros por columna (buscador simple en memoria)
  const [filters, setFilters] = useState({
    username: "",
    email: "",
    role: "",
    estado: "", // "activo" | "inactivo" | ""
  });

  // Traer usuarios del backend
  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getUsersRequest();
      setUsuarios(res.data || []);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      message.error("Error al cargar usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Al montar el componente, cargo la lista de usuarios
  useEffect(() => {
    loadUsers();
  }, []);

  // Actualiza el estado de filtros cuando el usuario escribe en los inputs
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Activar / desactivar un usuario (toggle isActive)
  const handleToggleActive = async (record) => {
    try {
      const newStatus = !record.isActive;

      // Mando todos los datos obligatorios + isActive invertido
      await updateUserRequest(record._id, {
        username: record.username,
        email: record.email,
        role: record.role,
        isActive: newStatus,
        password: "", // el backend ignora string vacío para no pisar la contraseña
      });

      // Actualizo la lista local sin volver a pedir todo
      setUsuarios((prev) =>
        prev.map((u) =>
          u._id === record._id ? { ...u, isActive: newStatus } : u
        )
      );

      message.success(
        `Usuario ${newStatus ? "activado" : "desactivado"} correctamente`
      );
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message || "Error al cambiar estado del usuario";
      message.error(msg);
    }
  };

  // Borrar usuario
  const handleDelete = async (id) => {
    try {
      await deleteUserRequest(id);
      // Lo saco también de la lista en memoria
      setUsuarios((prev) => prev.filter((u) => u._id !== id));
      message.success("Usuario borrado correctamente");
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message || "Error al borrar el usuario";
      message.error(msg);
    }
  };

  // Aplico filtros en memoria sobre la lista de usuarios
  const filteredUsuarios = useMemo(() => {
    if (!usuarios) return [];

    const filtrados = usuarios.filter((u) => {
      const matchUsername = u.username
        ?.toLowerCase()
        .includes(filters.username.toLowerCase());

      const matchEmail = u.email
        ?.toLowerCase()
        .includes(filters.email.toLowerCase());

      const matchRole = u.role
        ?.toLowerCase()
        .includes(filters.role.toLowerCase());

      let matchEstado = true;
      if (filters.estado.toLowerCase() === "activo") {
        matchEstado = u.isActive === true;
      } else if (filters.estado.toLowerCase() === "inactivo") {
        matchEstado = u.isActive === false;
      }

      return matchUsername && matchEmail && matchRole && matchEstado;
    });

    // Orden por defecto: username, email
    return [...filtrados].sort((a, b) => {
      const uA = (a.username || "").toLowerCase();
      const uB = (b.username || "").toLowerCase();
      const byUsername = uA.localeCompare(uB);
      if (byUsername !== 0) return byUsername;

      const eA = (a.email || "").toLowerCase();
      const eB = (b.email || "").toLowerCase();
      return eA.localeCompare(eB);
    });
  }, [usuarios, filters]);

  // Definición de columnas de la tabla
  const columns = [
    {
      title: (
        <div>
          <div>Usuario</div>
          <Input
            placeholder="Filtrar"
            size="small"
            value={filters.username}
            onChange={(e) => handleFilterChange("username", e.target.value)}
          />
        </div>
      ),
      dataIndex: "username",
      key: "username",
      sorter: (a, b) => a.username.localeCompare(b.username),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <div>
          <div>Email</div>
          <Input
            placeholder="Filtrar"
            size="small"
            value={filters.email}
            onChange={(e) => handleFilterChange("email", e.target.value)}
          />
        </div>
      ),
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <div>
          <div>Rol</div>
          <Input
            placeholder="Filtrar"
            size="small"
            value={filters.role}
            onChange={(e) => handleFilterChange("role", e.target.value)}
          />
        </div>
      ),
      dataIndex: "role",
      key: "role",
      render: (role) => {
        // Coloreo el rol según sea Admin o Preceptor
        const color = role === "Admin" ? "volcano" : "geekblue";
        return <Tag color={color}>{role}</Tag>;
      },
      sorter: (a, b) => a.role.localeCompare(b.role),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: (
        <div>
          <div>Estado</div>
          <Input
            placeholder="activo / inactivo"
            size="small"
            value={filters.estado}
            onChange={(e) => handleFilterChange("estado", e.target.value)}
          />
        </div>
      ),
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <Tag color="green">Activo</Tag>
        ) : (
          <Tag color="red">Inactivo</Tag>
        ),
      sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Acciones",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {/* Navega al formulario de edición */}
          <Link to={`/usuarios/${record._id}`}>Editar</Link>

          {/* Botón para activar / desactivar */}
          <Button size="small" onClick={() => handleToggleActive(record)}>
            {record.isActive ? "Desactivar" : "Activar"}
          </Button>

          {/* Confirmación antes de borrar */}
          <Popconfirm
            title="¿Seguro que querés borrar este usuario?"
            okText="Sí"
            cancelText="No"
            okButtonProps={{ type: "primary", danger: true }}
            onConfirm={() => handleDelete(record._id)}
          >
            <Button size="small" danger>
              Borrar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Usuarios del sistema</h1>

        <Button
          onClick={() => navigate("/add-usuario")}
          className="btn-white-outline"
        >
          Crear usuario
        </Button>
      </div>

      <Table
        dataSource={filteredUsuarios}
        columns={columns}
        rowKey="_id"
        loading={loading}
        pagination={false}
      />
    </div>
  );
}

export default UsuariosPage;