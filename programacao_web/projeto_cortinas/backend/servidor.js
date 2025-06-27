const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const porta = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'emily_decoracoes'
});
db.connect(erro => {
  if (erro) {
    console.error('Erro ao conectar com o banco de dados:', erro);
    return;
  }
  console.log('Backend conectado com sucesso ao banco de dados MySQL.');
});
app.set('db', db);

const rotasProdutos = require('./rotas/produtos');
const rotasCliente = require('./rotas/cliente');
const rotasAdmin = require('./rotas/admin');

app.use('/produtos', rotasProdutos);
app.use('/cliente', rotasCliente);
app.use('/admin', rotasAdmin);

app.listen(porta, () => {
  console.log(`Servidor backend rodando na porta ${porta}`);
});