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

      {isAuthenticated && (
        <Menu theme="dark" mode="horizontal" style={{ lineHeight: '64px' }}>

          {/* ----------------------------
              ALUMNOS 
          ----------------------------- */}
          <SubMenu key="alumnos" title="Alumnos">
            <Menu.Item key="alumnos-list">
              <Link to="/alumnos">Lista de Alumnos</Link>
            </Menu.Item>

            {isAdmin && (
              <Menu.Item key="alumnos-add">
                <Link to="/add-alumno">Crear Alumno</Link>
              </Menu.Item>
            )}
          </SubMenu>

          {/* ----------------------------
              MATERIAS 
          ----------------------------- */}
          <SubMenu key="materias" title="Materias">
            <Menu.Item key="materias-list">
              <Link to="/materias">Lista de Materias</Link>
            </Menu.Item>

            {isAdmin && (
              <Menu.Item key="materias-add">
                <Link to="/add-materia">Crear Materia</Link>
              </Menu.Item>
            )}
          </SubMenu>

          {/* ----------------------------
              SOLO ADMIN:
          ----------------------------- */}
          {isAdmin && (
            <>
              <SubMenu key="comisiones" title="Cursos">
                <Menu.Item key="comisiones-list">
                  <Link to="/comisiones">Lista de Cursos</Link>
                </Menu.Item>

                <Menu.Item key="comisiones-add">
                  <Link to="/add-comision">Crear Curso</Link>
                </Menu.Item>
              </SubMenu>

              <SubMenu key="usuarios" title="Usuarios">
                <Menu.Item key="usuarios-list">
                  <Link to="/usuarios">Lista de Usuarios</Link>
                </Menu.Item>

                <Menu.Item key="usuarios-add">
                  <Link to="/add-usuario">Crear Usuario</Link>
                </Menu.Item>
              </SubMenu>
            </>
          )}


          <Menu.Item key="logout" onClick={logout}>
            Salir
          </Menu.Item>
        </Menu>
      )}
    </Header>
  );
}

export default Navbar;
