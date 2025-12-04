import React, { useEffect } from "react";
import { useMaterias } from "../context/MateriasContext";
import { useComisiones } from "../context/ComisionesContext";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Button, Form, Select, message } from "antd";

const { Option } = Select;

const MateriasFormPage = () => {
  const { createMateria, getMateria, updateMateria } = useMaterias();
  const { comisiones, getComisiones } = useComisiones();
  const navigate = useNavigate();
  const params = useParams();
  const [form] = Form.useForm();

  // Si viene id en la URL, estoy editando
  const isEdit = Boolean(params.id);

  // Al iniciar el componente, cargo las comisiones para completar el selector de cursos
  useEffect(() => {
    getComisiones();
  }, [getComisiones]);

  // Si es edición, cargo la materia desde el backend y completo el form
  useEffect(() => {
    async function loadMateria() {
      if (!isEdit) return;
      const materia = await getMateria(params.id);
      if (!materia) return;

      form.setFieldsValue({
        nombreMateria: materia.nombreMateria,
        docente: materia.docente,
        // Acá guardo la comisión como el numeroComision (ej: "1A")
        comision: materia.comision,
      });
    }
    loadMateria();
  }, [isEdit, params.id, getMateria, form]);

  // Envío del formulario
  const onFinish = async (values) => {
    try {
      if (isEdit) {
        await updateMateria(params.id, values);
        message.success("Materia actualizada correctamente");
      } else {
        await createMateria(values);
        message.success("Materia creada correctamente");
      }
      navigate("/materias");
    } catch (error) {
      console.error(error);
      message.error("Error al guardar la materia");
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
          maxWidth: "400px",
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
          {isEdit ? "Editar materia" : "Crear materia"}
        </h1>

        <Form
          name="materiasForm"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Materia"
            name="nombreMateria"
            rules={[{ required: true, message: "Materia obligatoria" }]}
          >
            <Input placeholder="Materia" autoFocus />
          </Form.Item>

          <Form.Item
            label="Docente"
            name="docente"
            rules={[{ required: true, message: "Docente obligatorio" }]}
          >
            <Input placeholder="Docente" />
          </Form.Item>

          <Form.Item
            label="Curso / Comisión"
            name="comision"
            rules={[{ required: true, message: "Curso obligatorio" }]}
          >
            <Select placeholder="Seleccioná un curso">
              {comisiones.map((c) => (
                <Option
                  key={c._id}
                  value={c.numeroComision}
                  // Si en la materia guardaras el ObjectId, sería: value={c._id}
                >
                  {`${c.anio}° año - Curso ${c.curso}`}
                </Option>
              ))}
            </Select>
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
            >
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default MateriasFormPage;
