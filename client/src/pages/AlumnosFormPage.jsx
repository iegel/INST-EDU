import { useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Input, Select, Button, message, Switch } from "antd";
import { useAlumnos } from "../context/AlumnosContext";
import { useComisiones } from "../context/ComisionesContext";

const { Option } = Select;

function AlumnosFormPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const params = useParams();

  const { createAlumno, getAlumno, updateAlumno } = useAlumnos();
  const { comisiones, getComisiones } = useComisiones();

  // Si viene un :id en la URL, sé que estoy editando
  const isEdit = Boolean(params.id);

  // Al iniciar el componente, cargo las comisiones para completar el selector de cursos
  useEffect(() => {
    getComisiones();
  }, []);

  // Ordeno las comisiones por año y luego por letra de curso (1A,1B,2A...)
  const comisionesOrdenadas = useMemo(() => {
    if (!comisiones) return [];
    return [...comisiones].sort((a, b) => {
      if (a.anio !== b.anio) return a.anio - b.anio;
      const cursoA = (a.curso || "").toString().toUpperCase();
      const cursoB = (b.curso || "").toString().toUpperCase();
      return cursoA.localeCompare(cursoB);
    });
  }, [comisiones]);

  // Si estoy en edición, cargo el alumno
  useEffect(() => {
    async function loadAlumno() {
      if (!isEdit) return;
      const alumno = await getAlumno(params.id);
      if (!alumno) return;

      form.setFieldsValue({
        nombre: alumno.nombre,
        apellido: alumno.apellido,
        dni: alumno.dni,
        comision: alumno.comision,
        egresado: alumno.egresado ?? false,
      });
    }
    loadAlumno();
  }, [isEdit, params.id, form, getAlumno]);

  // Cuando envío el formulario correctamente
  const onFinish = async (values) => {
    try {
      const payload = {
        ...values,
        // Por las dudas, si no viene egresado lo seteo en false
        egresado: values.egresado ?? false,
      };

      if (isEdit) {
        await updateAlumno(params.id, payload);
        message.success("Alumno actualizado correctamente");
      } else {
        await createAlumno(payload);
        message.success("Alumno creado correctamente");
      }
      // Vuelvo al listado de alumnos
      navigate("/alumnos");
    } catch (error) {
      console.error(error);
      message.error("Error al guardar el alumno");
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
        width: "100vw",
      }}
    >
      <div
        style={{
          background: "#f0f2f5",
          maxWidth: "600px",
          width: "100%",
          padding: "24px 32px",
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
          {isEdit ? "Editar alumno" : "Crear alumno"}
        </h1>

        <Form
          name="alumnoForm"
          form={form}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          initialValues={{
            egresado: false,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Nombre"
            name="nombre"
            rules={[{ required: true, message: "Ingresá el nombre" }]}
          >
            <Input placeholder="Nombre" />
          </Form.Item>

          <Form.Item
            label="Apellido"
            name="apellido"
            rules={[{ required: true, message: "Ingresá el apellido" }]}
          >
            <Input placeholder="Apellido" />
          </Form.Item>

          <Form.Item
            label="DNI"
            name="dni"
            rules={[{ required: true, message: "Ingresá el DNI" }]}
          >
            <Input placeholder="DNI" />
          </Form.Item>

          <Form.Item
            label="Curso / Comisión"
            name="comision"
            rules={[{ required: true, message: "Seleccioná un curso" }]}
          >
            <Select placeholder="Seleccioná un curso">
              {comisionesOrdenadas.map((c) => (
                <Option key={c._id} value={c.numeroComision}>
                  {`${c.anio}° año - Curso ${c.curso}`}
                </Option>
              ))}
            </Select>
          </Form.Item>

          {/* Solo muestro el switch de egresado cuando estoy editando */}
          {isEdit && (
            <Form.Item
              label="Egresado"
              name="egresado"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>
          )}

          <Form.Item
            wrapperCol={{
              offset: 6,
              span: 18,
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              style={{ background: "#1890ff", borderRadius: "4px" }}
            >
              {isEdit ? "Guardar cambios" : "Guardar"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default AlumnosFormPage;
