import React from 'react'
import { useAuth } from './context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'
import { ConfigProvider } from 'antd';
import esES from 'antd/lib/locale/es_ES';
function ProtectedRouteAdmin() {
    const {loading,isAdmin} = useAuth()

    if (loading) return <h1>
        Loading...
    </h1>
    if (!loading && !isAdmin) return <Navigate to='/' replace/> // Si no está autenticado que retorne al login
    return <Outlet/> ; //Para que continue con el componente de adentro
}

export default ProtectedRouteAdmin