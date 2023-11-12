import React, { useEffect } from 'react';
import { useMaterias } from '../context/MateriasContext';
import { Popconfirm, Space, Table, Tag } from 'antd';
import { Link } from 'react-router-dom';

function MateriasPage() {
  const { getMaterias, deleteMateria, materias } = useMaterias();

  useEffect(() => {
    getMaterias();
  }, []);

  if (materias.length === 0) return <h1>No hay materias</h1>;

  const columns = [
    {
      title: 'Materia',
      dataIndex: 'nombreMateria',
      key: 'nombreMateria',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Docente',
      dataIndex: 'docente',
      key: 'docente',
    },
    {
      title: 'Comision',
      dataIndex: 'comision',
      key: 'comision',
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/materias/${record._id}`}>Editar</Link>
          <Popconfirm
            title="¿Estás seguro de borrar esta materia?"
            onConfirm={() => deleteMateria(record._id)}
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
      <Table dataSource={materias} columns={columns} rowKey="_id" pagination={false} />
    </div>
  );
}

export default MateriasPage;
