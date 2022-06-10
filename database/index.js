const { Pool } = require('pg')
require('dotenv').config();

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
})

pool.connect();

// pool.query('SELECT NOW()', (err, res) => {
//   console.log(err, res);
// });

module.exports.pool = pool;