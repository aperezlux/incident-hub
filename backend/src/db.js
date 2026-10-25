require('dotenv').config();
const { Pool } = require('pg');

module.exports = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER || 'incident',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'incident_hub'
});
