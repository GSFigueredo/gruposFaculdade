import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CardProduto from '../components/CardProduto';
import Carrinho from '../components/Carrinho';
import AgendarVisita from '../components/AgendarVisita';
import FiltroProdutos from '../components/FiltroProdutos'; // Importa o novo componente

const PaginaInicial = () => {
    const [produtos, setProdutos] = useState([]);
    const [carrinho, setCarrinho] = useState([]);
    //Estado para guardar os filtros ativos
    const [filtros, setFiltros] = useState({});

    useEffect(() => {
        const params = new URLSearchParams(filtros).toString();
        
        axios.get(`http://localhost:3001/produtos?${params}`)
            .then(resposta => setProdutos(resposta.data))
            .catch(erro => console.error('Erro ao buscar produtos:', erro));
    }, [filtros]);

    const adicionarAoCarrinho = (produto) => {
        setCarrinho([...carrinho, produto]);
    };

    const removerDoCarrinho = (idProduto) => {
        setCarrinho(carrinho.filter(produto => produto.id !== idProduto));
    };
    
    //Função que recebe os filtros do componente filho e atualiza o estado
    const handleFiltroChange = (novosFiltros) => {
        const filtrosAtivos = Object.fromEntries(
            Object.entries(novosFiltros).filter(([_, v]) => v !== '')
        );
        setFiltros(filtrosAtivos);
    };

    return (
        <div>
            {/* O Carrinho e o Agendamento*/}
            <Carrinho itens={carrinho} onRemover={removerDoCarrinho} />
            <AgendarVisita />

            {/* Funcionalidade: Filtrar cortinas/persianas por categorias*/}
            <FiltroProdutos onFiltroChange={handleFiltroChange} />

            <h2>Nosso Catálogo</h2>
            {produtos.length > 0 ? (
                <div className="lista-produtos">
                    {produtos.map(produto => (
                        <CardProduto key={produto.id} produto={produto} onAdicionar={adicionarAoCarrinho} />
                    ))}
                </div>
            ) : (
                <p>Nenhum produto encontrado com os filtros selecionados.</p>
            )}
        </div>
    );
};

export default PaginaInicial;