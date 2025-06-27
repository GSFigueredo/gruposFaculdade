import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RotaProtegidaAdmin = ({ children }) => {
    const { usuario } = useAuth();

    if (!usuario || usuario.stadmin !== 1) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default RotaProtegidaAdmin;