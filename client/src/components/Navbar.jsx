import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout, Menu } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const { Header } = Layout;

function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();

  return (
    <Header style={{ background: '#1677FF', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <Link to={isAuthenticated ? '/alumnos' : '/'}>
          <h1 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold' }}>Instituto Educativo</h1>
        </Link>
      </div>
      {isAuthenticated ? (
        <Menu theme="dark" mode="horizontal" selectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/alumnos">Alumnos</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/add-alumno">Registar alumno</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/materias">Materias</Link>
          </Menu.Item>
          <Menu.Item key="4" onClick={logout}>
            Salir
          </Menu.Item>
        </Menu>
      ) : null}
    </Header>
  );
}

export default Navbar;