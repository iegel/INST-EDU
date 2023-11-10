import React from 'react'
import { useAuth } from './context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

function PotectedRoute() {
    const {loading,isAuthenticated} = useAuth()

    if (loading) return <h1>
        Loading...
    </h1>
    if (!loading && !isAuthenticated) return <Navigate to='/' replace/> // Si no está autenticado que retorne al login
    return <Outlet/> ; //Para que continue con el componente de adentro
}

export default PotectedRoute