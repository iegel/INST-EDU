import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, InputNumber, Button, Select, message } from "antd";
import { useComisiones } from "../context/ComisionesContext";
import { getUsersRequest } from "../api/auth";

const { Option } = Select;

function ComisionesFormPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();

  const { createComision, getComision, updateComision } = useComisiones();
  const [preceptores, setPreceptores] = useState([]);

  // Si hay :id en la URL, es edición
  const isEdit = Boolean(params.id);

  // Traigo la lista de preceptores (usuarios con rol Preceptor y activos)
  useEffect(() => {
    async function loadPreceptores() {
      try {
        const res = await getUsersRequest();
        const users = res.data || [];

        // Solo los usuarios que son Preceptor y están activos
        const precep = users.filter(
          (u) => u.role === "Preceptor" && u.isActive
        );
        setPreceptores(precep);
      } catch (error) {
        console.error(error);
        message.error("Error al cargar preceptores");
      }
    }
    loadPreceptores();
  }, []);

  // Si es edición, cargo la comisión y completo el formulario
  useEffect(() => {
    async function loadComision() {
      if (!isEdit) return;
      const comision = await getComision(params.id);
      if (!comision) return;

      form.setFieldsValue({
        anio: comision.anio,
        curso: comision.curso,
        // preceptor viene populado como objeto, me quedo con el _id
        preceptor: comision.preceptor?._id,
      });
    }
    loadComision();
  }, [isEdit, params.id, getComision, form]);

  const onFinish = async (values) => {
    // Armo la lista de datos como lo espera el backend
    const payload = {
      // numeroComision tipo "3A", "5B", etc.
      numeroComision: `${values.anio}${values.curso.toUpperCase()}`,
      anio: values.anio,
      curso: values.curso.toUpperCase(),
      // Preceptor es el _id del usuario
      preceptor: values.preceptor,
    };

    let result;
    if (isEdit) {
      result = await updateComision(params.id, payload);
    } else {
      result = await createComision(payload);
    }

    if (result && result.ok === false) {
      message.error(result.message || "Error al guardar el curso");
      return;
    }

    message.success("Curso guardado correctamente");
    navigate("/comisiones");
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <div className="bg-gray-100 text-black rounded-lg shadow-lg p-8 w-full max-w-xl">
        <h1
          style={{
            textAlign: "center",
            marginBottom: 24,
            fontWeight: "bold",
            color: "black",
          }}
        >
          {isEdit ? "Editar curso" : "Crear curso"}
        </h1>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={
              <span>
                <span className="text-red-500">*</span> Año
              </span>
            }
            name="anio"
            rules={[{ required: true, message: "Ingresá el año" }]}
          >
            <InputNumber
              min={1}
              max={5}
              className="w-full"
              placeholder="1, 2, 3, 4, 5"
            />
          </Form.Item>

          <Form.Item
            label={
              <span>
                <span className="text-red-500">*</span> Curso
              </span>
            }
            name="curso"
            rules={[{ required: true, message: "Ingresá el curso (A, B...)" }]}
          >
            <Input maxLength={1} placeholder="A, B, C..." />
          </Form.Item>

          <Form.Item
            label={
              <span>
                <span className="text-red-500">*</span> Preceptor
              </span>
            }
            name="preceptor"
            rules={[{ required: true, message: "Seleccioná un preceptor" }]}
          >
            <Select placeholder="Seleccioná un preceptor">
              {preceptores.map((p) => (
                <Option key={p._id} value={p._id}>
                  {p.username} ({p.email})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <div className="flex justify-center">
              <Button
                type="primary"
                htmlType="submit"
                style={{ background: "#1890ff", borderRadius: "4px" }}
              >
                {isEdit ? "Guardar cambios" : "Crear curso"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default ComisionesFormPage;
