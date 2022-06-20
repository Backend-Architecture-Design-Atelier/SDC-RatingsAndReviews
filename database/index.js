const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, './../example.env') });

const pool = new Pool({
  host: process.env.HOST,
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

console.log({
  host: process.env.HOST,
  user: process.env.DB_USER,
  database: process.env.DATABASE,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.connect();

module.exports.pool = pool;
