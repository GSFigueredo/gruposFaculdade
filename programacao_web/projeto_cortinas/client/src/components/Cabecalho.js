import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const Cabecalho = () => {
    const { usuario, logout } = useAuth();

    return (
        <header className="header">
            {/* A logo sempre leva para a página inicial */}
            <Link to="/">
                <img src={logo} alt="Emily Decorações Logo" />
            </Link>
            <nav>
                {/* Link para o catálogo*/}
                <Link to="/">Catálogo</Link>
                
                {/* Estrutura condicional para  mostrar dependendo do usuario logado*/}
                {usuario ? (
                    <>
                        <span style={{ margin: '0 20px' }}>Olá, {usuario.nome}</span>
                        <button onClick={logout} className="btn" style={{ background: 'none', color: 'var(--rosa-principal)', padding: '0 0 0 20px' }}>Sair</button>
                    </>
                ) : (
                    /* Estrutura condicional para clientes sem login */
                    <>
                        <Link to="/login">Login</Link>
                        {/* Link para o caso de uso "CADASTRAR-SE COMO CLIENTE" */}
                        <Link to="/cadastro">Cadastro</Link>
                    </>
                )}
                
                {/* Link para o painel de administração. 
                  Só aparece se o usuário estiver logado E se 'stadmin' for 1 (true).
                */}
                {usuario && usuario.stadmin === 1 && (
                    <Link to="/admin">Admin</Link>
                )}
            </nav>
        </header>
    );
};

export default Cabecalho;