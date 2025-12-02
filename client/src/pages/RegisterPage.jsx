import { Form, Input, Button, Card, Alert } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { useNavigate,Link } from 'react-router-dom';

function RegisterPage() {
  const { signup, isAuthenticated, errors: registerErrors } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/alumnos');
  }, [isAuthenticated]);

  const onFinish = async (values) => {
    signup(values);
  };

  return (
    <div className="h-screen flex justify-center items-center">
      {registerErrors.map((error, i) => (
        <Alert message={error} type="error" key={i} />
      ))}
      <Card style={{ background: '#262626', color: 'white' }}>
        <Form onFinish={onFinish}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Username is required' }]}
          >
            <Input placeholder="Username" />
          </Form.Item>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Email is required' }]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Password is required' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button color='#0050b3' type="primary" htmlType="submit" className="bg-blue-800">
              Register
            </Button>
          </Form.Item>
        </Form>
        <p className='flex gap-x-2 justify-between'>
          You have an account ? <Link to="/login" className='text-sky-500'>Login</Link>
        </p>
      </Card>
    </div>
  );
}

export default RegisterPage;
