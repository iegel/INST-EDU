import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DatePicker, Input, Button } from 'antd'; // Importa los componentes de Ant Design

function AlumnosFormPage() {
  const { signup, handleSubmit, setValue } = useForm();
  const { createAlumno, getAlumno, updateAlumno } = useAlumnos();
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    async function loadAlumno() {
      if (params.id) {
        const alumno = await getAlumno(params.id);
        getAlumno(params.id);
        setValue('nombre', alumno.nombre);
        setValue('apellido', alumno.apellido);
        setValue('dni', alumno.dni);
        setValue('comision', alumno.comision);
      }
    }
    loadAlumno();
  }, []);

  const onSubmit = handleSubmit((data) => {
    console.log('test')

    if (params.id) {
      updateAlumno(params.id, data);
    } else {
      createAlumno(data);
    }
    navigate('/alumnos');
  });

  return (
    <div style={{ background: '#f0f2f5', maxWidth: '400px', padding: '20px', borderRadius: '8px' }}>
      <form onSubmit={onSubmit}>
        <label htmlFor="nombre" style={{ color: 'black' }}>Nombre</label>
        <Input placeholder="Nombre" {...register('nombre')} style={{ width: '100%', marginBottom: '12px'}} autoFocus />

        <label htmlFor="apellido" style={{ color: 'black' }}>Apellido</label>
        <Input placeholder="Apellido" {...register('apellido')} style={{ width: '100%', marginBottom: '12px' }} />

        <label htmlFor="dni" style={{ color: 'black' }}>DNI</label>
        <Input placeholder="DNI" style={{ width: '100%', marginBottom: '12px' }} {...register('dni')} />

        <label htmlFor="comision" style={{ color: 'black' }}>Comision</label>
        <Input placeholder="Comision" style={{ width: '100%', marginBottom: '12px' }} {...register('comision')} />

        <Button type="primary" htmlType="submit" style={{ background: '#1890ff', borderRadius: '4px' }}>
          Guardar
        </Button>
      </form>
    </div>
  );
}

export default AlumnosFormPage;
