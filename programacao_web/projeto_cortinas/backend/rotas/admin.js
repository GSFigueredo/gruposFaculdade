const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// Rota para CADASTRAR um novo produto, implementando o requisito RQ9.
router.post('/produtos', upload.single('imagem'), (req, res) => {
    const db = req.app.get('db');
    const { nome, descricao, preco, tipo, cor, modelo } = req.body;
    const nomeImagem = req.file ? req.file.filename : null;

    if (!nome || !preco || !tipo) return res.status(400).send('Os campos Nome, Preço e Tipo são obrigatórios.');
    
    const sql = 'INSERT INTO Produtos (nome, descricao, preco, tipo, cor, modelo, imagem) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [nome, descricao, preco, tipo, cor, modelo, nomeImagem], (erro, resultado) => {
        if (erro) {
            console.error("Erro do MySQL ao criar:", erro); 
            return res.status(500).send(erro);
        }
        const produtoCompleto = { id: resultado.insertId, nome, descricao, preco, tipo, cor, modelo, imagem: nomeImagem };
        res.status(201).send(produtoCompleto);
    });
});

// --- Rota para EDITAR um produto, implementando o requisito RQ10 ---
router.put('/produtos/:id', upload.single('imagem'), (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const { nome, descricao, preco, tipo, cor, modelo } = req.body;
    
    const nomeImagem = req.file ? req.file.filename : req.body.imagem_existente;

    const sql = 'UPDATE Produtos SET nome = ?, descricao = ?, preco = ?, tipo = ?, cor = ?, modelo = ?, imagem = ? WHERE id = ?';
    db.query(sql, [nome, descricao, preco, tipo, cor, modelo, nomeImagem, id], (erro, resultado) => {
        if (erro) {
            console.error("Erro do MySQL ao atualizar:", erro);
            return res.status(500).send(erro);
        }
        if (resultado.affectedRows === 0) {
            return res.status(404).send('Produto não encontrado.');
        }
        const produtoAtualizado = { id: Number(id), nome, descricao, preco, tipo, cor, modelo, imagem: nomeImagem };
        res.status(200).send(produtoAtualizado);
    });
});


// Rota para REMOVER um produto, implementando o requisito RQ10.
router.delete('/produtos/:id', (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const sql = 'DELETE FROM Produtos WHERE id = ?';
    db.query(sql, [id], (erro) => {
        if (erro) return res.status(500).send(erro);
        res.send('Produto removido com sucesso.');
    });
});

// Rota para o prestador visualizar os agendamentos feitos, implementando o requisito RQ7.
router.get('/agendamentos', (req, res) => {
    const db = req.app.get('db');
    const sql = `
        SELECT a.id, a.data_agendamento, c.nome as cliente_nome, c.email as cliente_email
        FROM Agendamentos a JOIN Clientes c ON a.cliente_id = c.id
        ORDER BY a.data_agendamento DESC`;
    db.query(sql, (erro, resultados) => {
        if (erro) return res.status(500).send(erro);
        res.json(resultados);
    });
});

module.exports = router;