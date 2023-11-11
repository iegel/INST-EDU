import React, { useEffect } from 'react';
import { useAlumnos } from '../context/AlumnosContext';
import { Popconfirm, Space, Table, Tag } from 'antd';
import { Link } from 'react-router-dom';

function AlumnosPage() {
  const { getAlumnos, deleteAlumno, alumnos } = useAlumnos();

  useEffect(() => {
    getAlumnos();
  }, []);

  if (alumnos.length === 0) return <h1>No hay alumnos</h1>;

  const columns = [
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      key: 'nombre',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Apellido',
      dataIndex: 'apellido',
      key: 'apellido',
    },
    {
      title: 'DNI',
      dataIndex: 'dni',
      key: 'dni',
    },
    {
      title: 'Año',
      dataIndex: 'año',
      key: 'año',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/alumnos/${record._id}`}>Editar</Link>
          <Popconfirm
            title="¿Estás seguro de borrar este alumno?"
            onConfirm={() => deleteAlumno(record._id)}
            okText={<span style={{ color: '#333' }}>Sí</span>}
            cancelText={<span style={{ color: '#333' }}>No</span>}
          >
            <a>Borrar</a>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table dataSource={alumnos} columns={columns} rowKey="_id" pagination={false} />
    </div>
  );
}

export default AlumnosPage;
