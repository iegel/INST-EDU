import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useComisiones } from '../context/ComisionesContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Button, Form } from 'antd';

const ComisionesFormPage = () => {
  const { register } = useForm();
  const { createComision, getComision, updateComision } = useComisiones();
  const navigate = useNavigate();
  const params = useParams();
  const [form] = Form.useForm();

  useEffect(() => {
    async function loadComision() {
      if (params.id) {
        const comision = await getComision(params.id);
        getComision(params.id)
        form.setFieldsValue({
          numeroComision: comision.numeroComision,
          preceptor: comision.preceptor
        });

      }
    }
    loadComision()
  }, [])


  const onFinish = (values) => {
    if (params.id) {
      updateComision(params.id, values);
    } else {
      console.log(values);
      createComision(values);
    }
    navigate('/comisiones');
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
          name="comisionesForm"
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
          <Form.Item label="Comision" name="numeroComision" rules={[{ required: true, message: 'Comision obligatoria' }]}>
            <Input {...register('numeroComision')} placeholder="Comision" autoFocus />
          </Form.Item>

          <Form.Item label="Preceptor" name="preceptor" rules={[{ required: true, message: 'Preceptor obligatorio' }]}>
            <Input {...register('preceptor')} placeholder="Preceptor" />
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

export default ComisionesFormPage;