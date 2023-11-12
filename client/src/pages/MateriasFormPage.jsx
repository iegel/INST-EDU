import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMaterias } from '../context/MateriasContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Button, Form } from 'antd';

const MateriasFormPage = () => {
  const { register } = useForm();
  const { createMateria, getMateria, updateMateria } = useMaterias();
  const navigate = useNavigate();
  const params = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    async function loadMateria() {
      if (params.id) {
        const materia = await getMateria(params.id);
        getMateria(params.id)
        form.setFieldsValue({
          nombreMateria: materia.nombreMateria,
          docente: materia.docente,
          comision: materia.comision
        });

      }
    }
    loadMateria()
  }, [])


  const onFinish = (values) => {
    if (params.id) {
      updateMateria(params.id, values);
    } else {
      console.log(values);
      createMateria(values);
    }
    navigate('/materias');
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '90vh',
      width: '90vw',
    }}>
      <div style={{ background: '#f0f2f5', maxWidth: '400px', padding: '20px', borderRadius: '8px' }}>
        <Form
          name="materiasForm"
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
          <Form.Item label="Materia" name="nombreMateria" rules={[{ required: true, message: 'Materia obligatoria' }]}>
            <Input {...register('nombreMateria')} placeholder="Materia" autoFocus />
          </Form.Item>

          <Form.Item label="Docente" name="docente" rules={[{ required: true, message: 'Docente obligatorio' }]}>
            <Input {...register('docente')} placeholder="Docente" />
          </Form.Item>

          <Form.Item label="Comision" name="comision" rules={[{ required: true, message: 'Comision obligatoria' }]}>
            <Input {...register('comision')} placeholder="Comision" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" style={{ background: '#1890ff', borderRadius: '4px' }}>
              Guardar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default MateriasFormPage;