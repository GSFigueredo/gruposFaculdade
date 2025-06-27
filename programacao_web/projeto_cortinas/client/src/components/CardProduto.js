import React from 'react';

const CardProduto = ({ produto, onAdicionar }) => {
    const imageUrl = produto.imagem 
    ? `http://localhost:3001/uploads/${produto.imagem}` 
    : 'https://via.placeholder.com/280x200/E5007E/FFFFFF?Text=Emily+Decora%C3%A7%C3%B5es';

  const contatarPeloWhatsApp = () => {
    const mensagem = `Olá, tenho interesse no produto: ${produto.nome}. Poderia me dar mais informações?`;
    const urlWhatsapp = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
    window.open(urlWhatsapp, '_blank');
  };

  return (
    <div className="card-produto">
      {/* RQ1: Visualizar produtos com imagem e descrição */}
      <img src={imageUrl} alt={produto.nome} />
      <h3>{produto.nome}</h3>
      <p>{produto.descricao}</p>
      <p className="preco">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}</p>
      <div className="botoes-container">
        {/* RQ4: Adicionar produtos a um carrinho */}
        <button onClick={() => onAdicionar(produto)} className="btn btn-principal">Adicionar ao Carrinho</button>
        {/* RQ2: Iniciar conversa via WhatsApp com o vendedor */}
        <button onClick={contatarPeloWhatsApp} className="btn btn-secundario">Contato via WhatsApp</button>
      </div>
    </div>
  );
};

export default CardProduto;