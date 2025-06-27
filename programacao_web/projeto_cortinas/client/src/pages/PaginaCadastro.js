import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const PaginaCadastro = () => {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');

        try {
            // 1. Tenta registrar o novo usuário
            await axios.post('http://localhost:3001/cliente/registrar', { nome, email, senha });
            
            // 2. Se o registro for bem-sucedido, faz o login automático
            await login(email, senha);

        } catch (error) {
            if (error.response && error.response.data) {
                setErro(error.response.data); // Exibe a mensagem de erro do backend
            } else {
                setErro('Ocorreu um erro. Tente novamente.');
            }
        }
    };

    return (
        <div className="painel" style={{ maxWidth: '500px', margin: '40px auto' }}>
            <h2>Crie sua Conta</h2>
            <p>Cadastre-se para agendar visitas e finalizar seus pedidos.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome completo" required style={{padding: '10px'}} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" required style={{padding: '10px'}}/>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" required style={{padding: '10px'}}/>
                {erro && <p style={{ color: 'red' }}>{erro}</p>}
                <button type="submit" className="btn btn-principal">Cadastrar e Entrar</button>
            </form>
        </div>
    );
};

export default PaginaCadastro;