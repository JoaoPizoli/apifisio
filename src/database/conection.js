require('dotenv').config();

const knex = require('knex')({
  client: 'pg', 
  connection: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, 
});
knex
  .raw('SELECT 1+1 AS result')
  .then(() => {
    console.log('Conectado com sucesso ao banco de dados');
  })
  .catch((err) => {
    console.error('Erro ao conectar com o banco de dados:', err);
  });

module.exports = knex;
