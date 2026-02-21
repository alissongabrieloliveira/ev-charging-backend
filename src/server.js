require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());

// Usa as rotas criadas
app.use('/api', routes);

// Rota de teste
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'EV Charging API is running!' });
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});