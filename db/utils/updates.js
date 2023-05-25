const { Pool, Client } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const poolConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.TARGET_DB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

// const 