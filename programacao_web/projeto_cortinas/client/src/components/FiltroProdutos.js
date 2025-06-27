import React, { useState } from 'react';

const FiltroProdutos = ({ onFiltroChange }) => {
    const estadoInicial = {
        tipo: '',
        cor: '',
        precoMin: '',
        precoMax: ''
    };
    const [filtros, setFiltros] = useState(estadoInicial);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFiltros(prevFiltros => ({
            ...prevFiltros,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onFiltroChange(filtros); // Envia os filtros para o componente pai
    };

    const handleClear = () => {
        setFiltros(estadoInicial);
        onFiltroChange(estadoInicial); // Limpa os filtros no componente pai
    };

    return (
        <div className="painel-filtros">
            <h3>Filtrar Produtos</h3>
            <form onSubmit={handleSubmit} className="form-filtros">
                {/* Filtro por Tipo */}
                <div className="filtro-grupo">
                    <label>Tipo</label>
                    <select name="tipo" value={filtros.tipo} onChange={handleChange}>
                        <option value="">Todos</option>
                        <option value="cortina">Cortina</option>
                        <option value="persiana">Persiana</option>
                    </select>
                </div>

                {/* Filtro por Cor */}
                <div className="filtro-grupo">
                    <label>Cor</label>
                    <select name="cor" value={filtros.cor} onChange={handleChange}>
                        <option value="">Todas</option>
                        <option value="Branco">Branco</option>
                        <option value="Bege">Bege</option>
                        <option value="Cinza">Cinza</option>
                        <option value="Preto">Preto</option>
                    </select>
                </div>

                {/* Filtro por Preço */}
                <div className="filtro-grupo">
                    <label>Preço Mínimo</label>
                    <input type="number" name="precoMin" value={filtros.precoMin} onChange={handleChange} placeholder="R$" />
                </div>
                <div className="filtro-grupo">
                    <label>Preço Máximo</label>
                    <input type="number" name="precoMax" value={filtros.precoMax} onChange={handleChange} placeholder="R$" />
                </div>

                <div className="filtro-botoes">
                    <button type="submit" className="btn btn-secundario">Aplicar Filtros</button>
                    <button type="button" onClick={handleClear} className="btn" style={{background: '#777'}}>Limpar Filtros</button>
                </div>
            </form>
        </div>
    );
};

export default FiltroProdutos;