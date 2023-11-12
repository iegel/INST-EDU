import React, { useEffect } from 'react';
import { useComisiones } from '../context/ComisionesContext';
import { Popconfirm, Space, Table, Tag } from 'antd';
import { Link } from 'react-router-dom';

function ComisionesPage() {
  const { getComisiones, deleteComision, comisiones } = useComisiones();

  useEffect(() => {
    getComisiones();
  }, []);

  if (comisiones.length === 0) return <h1>No hay comisiones</h1>;

  const columns = [
    {
      title: 'Comision',
      dataIndex: 'numeroComision',
      key: 'numeroComision',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Preceptor',
      dataIndex: 'preceptor',
      key: 'preceptor',
    },
    {
      title: 'Acciones',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`/comisiones/${record._id}`}>Editar</Link>
          <Popconfirm
            title="¿Estás seguro de borrar esta comision?"
            onConfirm={() => deleteComision(record._id)}
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
      <Table dataSource={comisiones} columns={columns} rowKey="_id" pagination={false} />
    </div>
  );
}

export default ComisionesPage;
