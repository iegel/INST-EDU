import React from 'react';
import { Form, Input, Button, Typography } from 'antd';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const { Title } = Typography;

export default function LoginPage() {
  const { signin, errors: signinErrors, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onFinish = (values) => {
    signin(values);
  };

  useEffect(() => {
    if (isAuthenticated) navigate('/alumnos');
  }, [isAuthenticated]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 100px)', alignItems: 'center', justifyContent: 'center', background: '#3F3F46' }}>
      <div style={{ background: '#202020', maxWidth: '400px', width: '100%', padding: '20px', borderRadius: '8px' }}>
        {signinErrors.map((error, i) => (
          <div key={i} style={{ background: 'red', padding: '8px', color: 'white' }}>
            {error}
          </div>
        ))}
        <Title style={{color: 'white'}} level={2}>Ingreso</Title>
        <Form
          name="login"
          onFinish={onFinish}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: 'Please enter your email!',
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: 'Please enter your password!',
              },
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ background: 'blue', border: 'none' }}>
              Conectar
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
