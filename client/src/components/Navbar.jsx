import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layout, Menu } from 'antd';

const { Header } = Layout;
const { SubMenu } = Menu;

function Navbar() {
  const { isAuthenticated, logout, isAdmin } = useAuth();

  return (
    <Header
      style={{
        background: '#1677FF',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div>
        <Link to={isAuthenticated ? '/alumnos' : '/'}>
          <h1
            style={{
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
            }}
          >
            Instituto Educativo
          </h1>
        </Link>
      </div>

      {isAuthenticated ? (
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ lineHeight: '64px' }}
        >
          {/* 👇 Esto lo ven TODOS los logueados (Admin y Preceptor) */}
          <SubMenu key="alumnos" title="Alumnos">
            <Menu.Item key="1">
              <Link to="/alumnos">Lista de Alumnos</Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/add-alumno">Crear Alumno</Link>
            </Menu.Item>
          </SubMenu>

          {/* 👇 Estas SOLO las ve el ADMIN */}
          {isAdmin && (
            <>
              <SubMenu key="materias" title="Materias">
                <Menu.Item key="3">
                  <Link to="/materias">Lista de Materias</Link>
                </Menu.Item>
                <Menu.Item key="4">
                  <Link to="/add-materia">Crear Materia</Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu key="comisiones" title="Cursos">
                <Menu.Item key="5">
                  <Link to="/comisiones">Lista de Cursos</Link>
                </Menu.Item>
                <Menu.Item key="6">
                  <Link to="/add-comision">Crear Curso</Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu key="usuarios" title="Usuarios">
                <Menu.Item key="7">
                  <Link to="/usuarios">Lista de Usuarios</Link>
                </Menu.Item>
                <Menu.Item key="8">
                  <Link to="/add-usuario">Crear Usuario</Link>
                </Menu.Item>
              </SubMenu>
            </>
          )}

          <Menu.Item key="10" onClick={logout}>
            Salir
          </Menu.Item>
        </Menu>
      ) : null}
    </Header>
  );
}

export default Navbar;
