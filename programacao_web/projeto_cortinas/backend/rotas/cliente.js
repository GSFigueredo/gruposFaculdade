const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SEGREDO_JWT = 'seu_segredo_super_secreto';

// Rota para REGISTRAR um novo cliente
router.post('/registrar', async (req, res) => {
    const db = req.app.get('db');
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) return res.status(400).send('Todos os campos são obrigatórios.');

    try {
        const hashSenha = await bcrypt.hash(senha, 10);
        const sql = 'INSERT INTO Clientes (nome, email, senha) VALUES (?, ?, ?)';
        db.query(sql, [nome, email, hashSenha], (erro, resultado) => {
            if (erro) {
                if (erro.code === 'ER_DUP_ENTRY') return res.status(409).send('Este e-mail já está cadastrado.');
                return res.status(500).send('Erro no servidor ao registrar cliente.');
            }
            res.status(201).send({ id: resultado.insertId, mensagem: 'Cliente cadastrado com sucesso!' });
        });
    } catch (erro) {
        res.status(500).send('Erro ao processar a senha.');
    }
});

// Rota para LOGIN do cliente
router.post('/login', (req, res) => {
    const db = req.app.get('db');
    const { email, senha } = req.body;
    const sql = 'SELECT * FROM Clientes WHERE email = ?';
    db.query(sql, [email], async (erro, resultados) => {
        if (erro) return res.status(500).send('Erro no servidor.');
        if (resultados.length === 0) return res.status(404).send('E-mail ou senha inválidos.');

        const cliente = resultados[0];
        const senhaCorreta = await bcrypt.compare(senha, cliente.senha);
        if (!senhaCorreta) return res.status(401).send('E-mail ou senha inválidos.');

        const payload = {
            id: cliente.id,
            nome: cliente.nome,
            email: cliente.email,
            stadmin: cliente.stadmin
        };
        const token = jwt.sign(payload, SEGREDO_JWT, { expiresIn: '1h' });
        res.json({ token, cliente: payload });
    });
});

// --- ROTA DE AGENDAMENTO ATUALIZADA COM VERIFICAÇÃO ---
// Implementa a regra de negócio para não permitir agendamentos no mesmo horário.
router.post('/agendar-visita', (req, res) => {
    const db = req.app.get('db');
    const { cliente_id, data_agendamento } = req.body;

    // Passo 1: Verificar se o horário já está ocupado.
    const sqlVerificacao = 'SELECT id FROM Agendamentos WHERE data_agendamento = ?';
    db.query(sqlVerificacao, [data_agendamento], (erroVerificacao, resultados) => {
        if (erroVerificacao) {
            return res.status(500).send('Erro no servidor ao verificar agendamentos.');
        }

        // Se encontrou algum resultado, o horário já está agendado.
        if (resultados.length > 0) {
            return res.status(409).send('Este horário já está ocupado. Por favor, escolha outro.');
        }

        // Passo 2: Se o horário estiver livre, insere o novo agendamento.
        const sqlInsercao = 'INSERT INTO Agendamentos (cliente_id, data_agendamento) VALUES (?, ?)';
        db.query(sqlInsercao, [cliente_id, data_agendamento], (erroInsercao) => {
            if (erroInsercao) {
                return res.status(500).send('Erro no servidor ao criar o agendamento.');
            }
            res.status(201).send('Visita agendada com sucesso!');
        });
    });
});


// Rota para o cliente finalizar um pedido
router.post('/criar-pedido', (req, res) => {
    const db = req.app.get('db');
    const { cliente_id, produtos } = req.body;
    const sqlPedido = 'INSERT INTO Pedidos (cliente_id, status) VALUES (?, ?)';
    db.query(sqlPedido, [cliente_id, 'Pendente'], (erro, resultado) => {
        if (erro) return res.status(500).send('Erro ao criar o pedido.');
        
        const pedido_id = resultado.insertId;
        const sqlItens = 'INSERT INTO Pedido_Produtos (pedido_id, produto_id, quantidade) VALUES ?';
        const valoresItens = produtos.map(p => [pedido_id, p.id, p.quantidade || 1]);
        db.query(sqlItens, [valoresItens], (erro) => {
            if (erro) return res.status(500).send('Erro ao adicionar produtos ao pedido.');
            res.status(201).send({ pedido_id: pedido_id, mensagem: 'Pedido criado com sucesso!' });
        });
    });
});

module.exports = router;