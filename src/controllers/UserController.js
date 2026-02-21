const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../database/connection');

class UserController {
    // Cadastro de novo usuário
    async register(req, res) {
        const { name, email, password } = req.body;

        try {
            // 1. Verifica se o usuário já existe
            const userExists = await db('users').where({ email }).first();
            if (userExists) {
                return res.status(400).json({ error: 'E-mail já cadastrado.' });
            }

            // 2. Criptografa a senha
            const salt = await bcrypt.genSalt(10);
            const password_hash = await bcrypt.hash(password, salt);

            // 3. Insere no banco de dados (retornando os dados inseridos)
            const [newUser] = await db('users').insert({
                name,
                email,
                password_hash
            }).returning(['id', 'name', 'email', 'balance_cents']);

            // 4. Gera o Token JWT
            const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET || 'super_secret_key', {
                expiresIn: '7d' // O token expira em 7 dias
            });

            return res.status(201).json({ user: newUser, token });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro interno ao cadastrar usuário.' });
        }
    }

    // Login de usuário existente
    async login(req, res) {
        const { email, password } = req.body;

        try {
            // 1. Busca o usuário pelo e-mail
            const user = await db('users').where({ email }).first();
            if (!user) {
                return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
            }

            // 2. Compara a senha enviada com o hash salvo no banco
            const passwordMatch = await bcrypt.compare(password, user.password_hash);
            if (!passwordMatch) {
                return res.status(401).json({ error: 'E-mail ou senha incorretos.' });
            }

            // 3. Gera o Token JWT
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'super_secret_key', {
                expiresIn: '7d'
            });

            // 4. Remove o password_hash do objeto de retorno por segurança
            delete user.password_hash;

            return res.status(200).json({ user, token });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Erro interno ao realizar login.' });
        }
    }
}

module.exports = new UserController();