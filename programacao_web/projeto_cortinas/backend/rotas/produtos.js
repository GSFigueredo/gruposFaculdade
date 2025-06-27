const express = require('express');
const router = express.Router();

// Rota para buscar produtos com filtros avançados, incluindo preço.
router.get('/', (req, res) => {
  const db = req.app.get('db');
  let sql = 'SELECT * FROM Produtos WHERE 1=1';
  const params = [];

  // Filtro por tipo (cortina/persiana)
  if (req.query.tipo) {
    sql += ' AND tipo = ?';
    params.push(req.query.tipo);
  }
  // Filtro por cor
  if (req.query.cor) {
    sql += ' AND cor = ?';
    params.push(req.query.cor);
  }
  
  // --Lógica para filtrar por faixa de preço ---
  if (req.query.precoMin) {
    sql += ' AND preco >= ?';
    params.push(req.query.precoMin);
  }
  if (req.query.precoMax && req.query.precoMax > 0) {
    sql += ' AND preco <= ?';
    params.push(req.query.precoMax);
  }

  db.query(sql, params, (erro, resultados) => {
    if (erro) {
      console.error("Erro na busca com filtros:", erro);
      return res.status(500).send(erro);
    }
    res.json(resultados);
  });
});

module.exports = router;