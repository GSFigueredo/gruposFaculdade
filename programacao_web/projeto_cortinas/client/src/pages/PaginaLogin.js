import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PaginaLogin = () => {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErro('');
        try {
            await login(email, senha);
        } catch (error) {
            setErro('E-mail ou senha inválidos. Tente novamente.');
        }
    };

    return (
        <div className="painel" style={{ maxWidth: '500px', margin: '40px auto' }}>
            <h2>Acessar sua Conta</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail" required style={{padding: '10px'}}/>
                <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} placeholder="Senha" required style={{padding: '10px'}}/>
                {erro && <p style={{ color: 'red' }}>{erro}</p>}
                <button type="submit" className="btn btn-principal">Entrar</button>
            </form>
            <p style={{textAlign: 'center', marginTop: '20px'}}>
                Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
            </p>
        </div>
    );
};

export default PaginaLogin;