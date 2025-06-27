import React from 'react';
import axios from 'axios';

const Carrinho = ({ itens, onRemover }) => {
    const finalizarPedido = () => {
        if (itens.length === 0) return;

        // Simula o ID do cliente logado
        const dadosPedido = { cliente_id: 1, produtos: itens };

        axios.post('http://localhost:3001/cliente/criar-pedido', dadosPedido)
            .then(resposta => {
                const nomesProdutos = itens.map(p => p.nome).join(', ');
                const mensagem = `Olá, gostaria de finalizar meu pedido #${resposta.data.pedido_id} com os itens: ${nomesProdutos}.`;
                const urlWhatsapp = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
                window.open(urlWhatsapp, '_blank');
            })
            .catch(erro => alert('Falha ao criar o pedido.'));
    };

    return (
        <div className="painel">
            <h2>Carrinho de Compras</h2>
            {itens.length === 0 ? (
                <p>Seu carrinho está vazio.</p>
            ) : (
                <>
                    <ul style={{listStyle: 'none', padding: 0}}>
                        {itens.map((item, index) => (
                            <li key={index} style={{display: 'flex', justifyContent: 'space-between', padding: '5px 0'}}>
                                {item.nome}
                                <button onClick={() => onRemover(item.id)} style={{background: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '20px', height: '20px', cursor: 'pointer'}}>X</button>
                            </li>
                        ))}
                    </ul>
                    <button onClick={finalizarPedido} className="btn btn-principal" style={{marginTop: '20px'}}>
                        Finalizar Pedido via WhatsApp
                    </button>
                </>
            )}
        </div>
    );
};

export default Carrinho;