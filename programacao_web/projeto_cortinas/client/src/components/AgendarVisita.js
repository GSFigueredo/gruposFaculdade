import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useModal } from '../context/ModalContext';

const AgendarVisita = () => {
    const [data, setData] = useState('');
    const { usuario } = useAuth();
    const { showAlert } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!usuario) {
            showAlert('Você precisa estar logado para agendar uma visita.', 'error');
            return;
        }

        const dadosAgendamento = { 
            cliente_id: usuario.id,
            data_agendamento: data 
        };

        axios.post('http://localhost:3001/cliente/agendar-visita', dadosAgendamento)
            .then(() => {
                showAlert('Visita agendada com sucesso!', 'success');
                setData('');
            })
            .catch((erro) => {
                if (erro.response && erro.response.status === 409) {
                    showAlert(erro.response.data, 'error');
                } else {
                    showAlert('Falha ao agendar visita. Tente novamente mais tarde.', 'error');
                }
                console.error("Erro ao agendar:", erro);
            });
    };

    return (
        <div className="painel">
            <h2>Agendar uma Visita Técnica</h2>
            <form onSubmit={handleSubmit} style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                <input 
                    type="datetime-local" 
                    value={data} 
                    onChange={(e) => setData(e.target.value)} 
                    required 
                    style={{flexGrow: 1, padding: '10px'}}
                />
                <button type="submit" className="btn btn-secundario">Agendar</button>
            </form>
            {!usuario && <p style={{color: 'red', marginTop: '10px'}}>Faça login para poder agendar.</p>}
        </div>
    );
};

export default AgendarVisita;