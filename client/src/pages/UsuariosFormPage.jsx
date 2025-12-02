import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Button, Select, Switch, message } from "antd";
import {
  registerRequest,
  getUserRequest,
  updateUserRequest,
} from "../api/auth";

const { Option } = Select;

const UsuariosFormPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [form] = Form.useForm();
  const [loadingUser, setLoadingUser] = useState(false);

  // Si hay :id en la URL, estoy editando
  const isEdit = Boolean(params.id);

  // Si es edición, cargo los datos del usuario actual
  useEffect(() => {
    async function loadUser() {
      if (!isEdit) return;
      try {
        setLoadingUser(true);
        const res = await getUserRequest(params.id);
        const user = res.data;

        // Pre-cargo los campos del formulario
        form.setFieldsValue({
          username: user.username,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
        });
      } catch (error) {
        console.error(error);
        message.error("Error al cargar el usuario");
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, [isEdit, params.id, form]);

  // Envío del formulario
  const onFinish = async (values) => {
    try {
      if (isEdit) {
        // En edición, la contraseña es opcional.
        // Si la dejo vacía, mando string vacío y el backend decide no cambiarla.
        const payload = {
          username: values.username,
          email: values.email,
          role: values.role,
          isActive: values.isActive,
          password: values.password || "", // backend ignora string vacío
        };

        const res = await updateUserRequest(params.id, payload);
        console.log("Usuario actualizado:", res.data);
        message.success("Usuario actualizado correctamente");
      } else {
        // En creación sí es obligatorio enviar contraseña
        const res = await registerRequest(values);
        console.log("Usuario creado:", res.data);
        message.success("Usuario creado correctamente");
      }

      // Vuelvo al listado de usuarios
      navigate("/usuarios");
    } catch (error) {
      console.error(error);
      const msg =
        error.response?.data?.message ||
        (Array.isArray(error.response?.data)
          ? error.response.data[0]
          : "Error al guardar el usuario");
      message.error(msg);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
        width: "90vw",
      }}
    >
      <div
        style={{
          background: "#f0f2f5",
          maxWidth: "450px",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            marginBottom: 20,
            fontWeight: "bold",
            color: "black",
          }}
        >
          {isEdit ? "Editar usuario" : "Crear usuario"}
        </h1>

        <Form
          name="usuarioForm"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            role: "Preceptor", // valor por defecto al crear
            isActive: true,
          }}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Usuario"
            name="username"
            rules={[{ required: true, message: "Usuario obligatorio" }]}
          >
            <Input placeholder="Usuario" autoFocus disabled={loadingUser} />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Email obligatorio" }]}
          >
            <Input placeholder="Email" disabled={loadingUser} />
          </Form.Item>

          <Form.Item
            label={isEdit ? "Nueva contraseña" : "Contraseña"}
            name="password"
            rules={
              isEdit
                ? [] // en edición es opcional
                : [{ required: true, message: "Contraseña obligatoria" }]
            }
          >
            <Input.Password
              placeholder={
                isEdit
                  ? "Dejar vacío para mantener la contraseña"
                  : "Contraseña"
              }
              disabled={loadingUser}
            />
          </Form.Item>

          <Form.Item
            label="Rol"
            name="role"
            rules={[{ required: true, message: "Rol obligatorio" }]}
          >
            <Select placeholder="Selecciona un rol" disabled={loadingUser}>
              <Option value="Admin">Admin</Option>
              <Option value="Preceptor">Preceptor</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Activo" name="isActive" valuePropName="checked">
            <Switch disabled={loadingUser} />
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: "#1890ff", borderRadius: "4px" }}
              loading={loadingUser}
            >
              {isEdit ? "Guardar cambios" : "Guardar"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default UsuariosFormPage;