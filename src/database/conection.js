require('dotenv').config();

const knex = require('knex')({
  client: 'pg',
  connection: {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
  pool: {
    min: 0,
    max: 10,
    acquireTimeoutMillis: 60000,
  },
  debug: true,
});

knex.raw('SELECT 1+1 AS result')
  .then(() => {
    console.log('Conectado com sucesso ao banco de dados');
  })
  .catch((err) => {
    console.error('Erro ao conectar com o banco de dados:', err);
  });

module.exports = knex;
