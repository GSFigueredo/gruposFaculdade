import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import Modal from './components/Modal';
import Cabecalho from './components/Cabecalho';
import RotaProtegidaAdmin from './components/RotaProtegidaAdmin';
import PaginaInicial from './pages/PaginaInicial';
import PaginaAdmin from './pages/PaginaAdmin';
import PaginaLogin from './pages/PaginaLogin';
import PaginaCadastro from './pages/PaginaCadastro';

import './App.css';

function App() {
  return (
    <Router>
        <AuthProvider>
            <ModalProvider>
                <div className="container">
                    <Cabecalho />
                    <main>
                        <Routes>
                            <Route path="/" element={<PaginaInicial />} />
                            <Route path="/login" element={<PaginaLogin />} />
                            <Route path="/cadastro" element={<PaginaCadastro />} />
                            <Route
                                path="/admin"
                                element={
                                    <RotaProtegidaAdmin>
                                        <PaginaAdmin />
                                    </RotaProtegidaAdmin>
                                }
                            />
                        </Routes>
                    </main>
                    <Modal />
                </div>
            </ModalProvider>
        </AuthProvider>
    </Router>
  );
}

export default App;