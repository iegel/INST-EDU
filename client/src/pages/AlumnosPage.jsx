import React, { useEffect } from 'react';
import { useAlumnos } from '../context/AlumnosContext';
import { Space, Table, Tag } from 'antd';

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
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Invite {record.name}</a>
        <a>Delete</a>
      </Space>
    ),
  },
];


function AlumnosPage() {
  const { getAlumnos, alumnos } = useAlumnos();
  useEffect(() => {
    getAlumnos();
  }, []);

  if (alumnos.length === 0) return <h1>No hay alumnos</h1>;

  return (
    <div>
      <Table dataSource={alumnos} columns={columns} rowKey="_id" pagination={false} />
    </div>
  );



<Table columns={columns} dataSource={alumnos} />;

}
export default AlumnosPage;
