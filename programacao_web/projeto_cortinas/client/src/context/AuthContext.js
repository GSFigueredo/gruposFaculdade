import React, { createContext, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [usuario, setUsuario] = useState(null);
    const navigate = useNavigate();

    const login = async (email, senha) => {
        try {
            const resposta = await axios.post('http://localhost:3001/cliente/login', { email, senha });
            setUsuario(resposta.data.cliente);
            localStorage.setItem('token', resposta.data.token);
            navigate('/');
            return resposta.data;
        } catch (erro) {
            console.error("Erro no login:", erro.response ? erro.response.data : erro.message);
            throw erro;
        }
    };

    const logout = () => {
        setUsuario(null);
        localStorage.removeItem('token');
        navigate('/login');
    };

    const value = { usuario, login, logout };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};