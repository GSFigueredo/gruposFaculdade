import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useModal } from '../context/ModalContext'; 

// RQ11: Acessar um painel simples para gerenciar os produtos.
const PaginaAdmin = () => {
    const [produtos, setProdutos] = useState([]);
    const [agendamentos, setAgendamentos] = useState([]);
    const [modoEdicao, setModoEdicao] = useState(null);
    const { showAlert, showConfirm } = useModal();

    const estadoInicialForm = { nome: '', descricao: '', preco: '', tipo: 'cortina', cor: '', modelo: '', imagem_existente: '' };
    const [formProduto, setFormProduto] = useState(estadoInicialForm);
    const [imagem, setImagem] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/produtos').then(res => setProdutos(res.data));
        axios.get('http://localhost:3001/admin/agendamentos').then(res => setAgendamentos(res.data));
    }, []);

    const handleFormChange = (e) => setFormProduto({ ...formProduto, [e.target.name]: e.target.value });
    const handleImagemChange = (e) => setImagem(e.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(formProduto).forEach(key => formData.append(key, formProduto[key]));
        if (imagem) formData.append('imagem', imagem);

        const url = modoEdicao ? `http://localhost:3001/admin/produtos/${modoEdicao}` : 'http://localhost:3001/admin/produtos';
        const method = modoEdicao ? 'put' : 'post';

        axios[method](url, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(res => {
            if (modoEdicao) {
                setProdutos(produtos.map(p => p.id === modoEdicao ? res.data : p));
                showAlert('Produto atualizado com sucesso!', 'success');
            } else {
                setProdutos([...produtos, res.data]);
                showAlert('Produto adicionado com sucesso!', 'success');
            }
            cancelarEdicao();
        })
        .catch(err => {
            console.error("Erro ao salvar produto:", err);
            showAlert('Falha ao salvar produto.', 'error');
        });
    };
    
    const iniciarEdicao = (produto) => {
        setModoEdicao(produto.id);
        setFormProduto({
            nome: produto.nome, descricao: produto.descricao, preco: produto.preco, tipo: produto.tipo,
            cor: produto.cor, modelo: produto.modelo, imagem_existente: produto.imagem || ''
        });
        window.scrollTo(0, 0); // Rola a página para o topo para ver o formulário
    };

    const cancelarEdicao = () => {
        setModoEdicao(null);
        setFormProduto(estadoInicialForm);
        setImagem(null);
        if(document.getElementById('imagem-input')) {
            document.getElementById('imagem-input').value = null;
        }
    };
    
    const handleDeleteProduto = (id) => {
        showConfirm("Tem certeza que deseja remover este produto?", () => {
            axios.delete(`http://localhost:3001/admin/produtos/${id}`)
            .then(() => {
                setProdutos(produtos.filter(p => p.id !== id));
                showAlert('Produto removido com sucesso!', 'success');
            })
            .catch(() => showAlert('Falha ao remover o produto.', 'error'));
        });
    };

    return (
        <div>
            <h2>Painel de Administração</h2>
            <section className="painel">
                <h3>{modoEdicao ? 'Editar Produto' : 'Cadastrar Novo Produto'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <input name="nome" value={formProduto.nome} onChange={handleFormChange} placeholder="Nome do Produto" required />
                    <textarea name="descricao" value={formProduto.descricao} onChange={handleFormChange} placeholder="Descrição" />
                    <input name="preco" value={formProduto.preco} onChange={handleFormChange} placeholder="Preço (ex: 199.90)" type="number" step="0.01" required />
                    <select name="tipo" value={formProduto.tipo} onChange={handleFormChange} required>
                        <option value="cortina">Cortina</option><option value="persiana">Persiana</option>
                    </select>
                    <input name="cor" value={formProduto.cor} onChange={handleFormChange} placeholder="Cor" />
                    <input name="modelo" value={formProduto.modelo} onChange={handleFormChange} placeholder="Modelo" />
                    <label>Imagem do Produto:</label>
                    <input type="file" name="imagem" id="imagem-input" onChange={handleImagemChange} />
                    {modoEdicao && formProduto.imagem_existente && <p>Imagem atual: {formProduto.imagem_existente}</p>}
                    
                    <button type="submit" className="btn btn-principal">{modoEdicao ? 'Salvar Alterações' : 'Adicionar Produto'}</button>
                    {modoEdicao && <button type="button" onClick={cancelarEdicao} className="btn" style={{background: '#777'}}>Cancelar Edição</button>}
                </form>
            </section>

            <section className="painel">
                <h3>Gerenciar Produtos Existentes</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {produtos.map(p => (
                        <li key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                            <div style={{display: 'flex', alignItems: 'center'}}>
                                <img src={`http://localhost:3001/uploads/${p.imagem}`} alt={p.nome} style={{width: '50px', height: '50px', marginRight: '15px', objectFit: 'cover', borderRadius: '4px'}} />
                                <span>{p.nome}</span>
                            </div>
                            <div>
                                <button onClick={() => iniciarEdicao(p)} className="btn btn-secundario" style={{marginRight: '10px'}}>Editar</button>
                                <button onClick={() => handleDeleteProduto(p.id)} className="btn" style={{ background: 'darkred', color: 'white' }}>Remover</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </section>
            
            <section className="painel">
                <h3>Agendamentos Recebidos</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {agendamentos.map(a => (
                        <li key={a.id} style={{ padding: '5px 0' }}>{new Date(a.data_agendamento).toLocaleString('pt-BR')} - <strong>{a.cliente_nome}</strong> ({a.cliente_email})</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default PaginaAdmin;