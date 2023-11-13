import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, useParams } from 'react-router-dom';
import { Input, Button, Form, Select } from 'antd';

const { Option } = Select;

const UsuariosFormPage = () => {
  const { register } = useForm();
  const { signup, errors: registerErrors } = useAuth();
  const navigate = useNavigate();
  const params = useParams();
  const [form] = Form.useForm();
  const [defaultRole, setDefaultRole] = useState('Preceptor');

  const onFinish = (values) => {
    console.log(values);
    signup(values);
    navigate('/alumnos');
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
          name="usuarioForm"
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 16,
          }}
          initialValues={{
            remember: true,
            role: defaultRole, // Establecer el valor predeterminado del rol
          }}
          form={form}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item label="Usuario" name="username" rules={[{ required: true, message: 'Usuario obligatorio' }]}>
            <Input {...register('username')} placeholder="Usuario" autoFocus />
          </Form.Item>

          <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Email obligatorio' }]}>
            <Input {...register('email')} placeholder="Email" />
          </Form.Item>

          <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Contraseña obligatoria' }]}>
            <Input.Password {...register('password')} placeholder="Contraseña" />
          </Form.Item>

          <Form.Item label="Rol" name="role" rules={[{ required: true, message: 'Rol obligatorio' }]}>
            <Select
              {...register('role')}
              placeholder="Selecciona un rol"
            >
              <Option value="Admin">Admin</Option>
              <Option value="Preceptor">Preceptor</Option>
            </Select>
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

export default UsuariosFormPage;
