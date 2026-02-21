const knex = require('knex');
const knexfile = require('../../knexfile');

// Usa a configuração de desenvolvimento por padrão
const environment = process.env.NODE_ENV || 'development';
const connection = knex(knexfile[environment]);

module.exports = connection;