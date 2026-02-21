const express = require('express');
const UserController = require('../controllers/UserController');
const authMiddleware = require('../middlewares/auth');

const routes = express.Router();

// Rotas públicas
routes.post('/register', UserController.register);
routes.post('/login', UserController.login);

// Todas as rotas declaradas abaixo exigirão um token válido no header
routes.use(authMiddleware);

// Rota de teste para validar se o usuário consegue ver o próprio perfil
routes.get('/me', async (req, res) => {
    const db = require('../database/connection');

    try {
        // Usa o req.userId que foi injetado pelo middleware
        const user = await db('users').where({ id: req.userId }).first();

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Remove a senha antes de devolver os dados
        delete user.password_hash;

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar perfil.' });
    }
});

module.exports = routes;