import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAlumnos } from '../context/AlumnosContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Button, Form } from 'antd';

const AlumnosFormPage = () => {
  const { register,setValue} = useForm();
  const { createAlumno, getAlumno, updateAlumno } = useAlumnos();
  const navigate = useNavigate();
  const params = useParams();
  const [form] = Form.useForm();

  useEffect(()=>{
    async function loadAlumno() {
      if (params.id){
        const alumno = await getAlumno(params.id);
        getAlumno(params.id)
        form.setFieldsValue({
          nombre: alumno.nombre,
          apellido: alumno.apellido,
          dni: alumno.dni,
          año: alumno.año
        });

      }
    }
    loadAlumno()
  },[])


  const onFinish = (values) => {
    if (params.id) {
      updateAlumno(params.id, values);
    } else {
      console.log(values);
      createAlumno(values);
    }
    navigate('/alumnos');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ background: '#f0f2f5', maxWidth: '400px', padding: '20px', borderRadius: '8px' }}>
      <Form
        name="alumnosForm"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        initialValues={{
          remember: true,
      }}
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Nombre" name="nombre">
          <Input {...register('nombre')} placeholder="Nombre" autoFocus />
        </Form.Item>

        <Form.Item label="Apellido" name="apellido">
          <Input {...register('apellido')} placeholder="Apellido" />
        </Form.Item>

        <Form.Item label="DNI" name="dni">
          <Input {...register('dni')} placeholder="DNI" />
        </Form.Item>

        <Form.Item label="Año" name="año">
          <Input {...register('año')} placeholder="Año" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" style={{ background: '#1890ff', borderRadius: '4px' }}>
            Guardar
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AlumnosFormPage;