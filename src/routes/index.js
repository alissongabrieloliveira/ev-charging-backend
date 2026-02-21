const express = require('express');
const UserController = require('../controllers/UserController');

const routes = express.Router();

// Rotas públicas
routes.post('/register', UserController.register);
routes.post('/login', UserController.login);

module.exports = routes;