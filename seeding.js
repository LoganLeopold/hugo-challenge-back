const { Pool, Client } = require('pg')
const dotenv = require('dotenv');
dotenv.config()
  
const clientConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
}

const poolConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.TARGET_DB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
}

/*
  toggleDb creates and drops the target database
  true for open, false for close
*/
const toggleDb = async (boolean) => {
  console.log(`toggleDb: ${boolean ? 'open' : 'closed'}`);
  const client = new Client(clientConfig);
  const query = boolean 
    ? `CREATE DATABASE ${process.env.TARGET_DB};`
    : `DROP DATABASE IF EXISTS ${process.env.TARGET_DB}`;
  try {
    await client.connect();
    const toggle = await client.query(query);
    console.log(toggle);
  } catch (error) {
    console.log(`There was an error ${boolean ? 'opening' : 'closing'} the database.`);
    console.log('\n');
    console.log(error);
    await client.end();
  }
}

// base table queries 
const createUserTableQuery = `CREATE TABLE IF NOT EXISTS users (
  Users int,
  LastName varchar(255),
  FirstName varchar(255),
  Birthday varchar(6),
  Street varchar(255),
  City varchar(255),
  State varchar(75),
  Zipcode int
);`

const createVehicleTableQuery = `CREATE TABLE IF NOT EXISTS vehicles (
  VIN varchar(225),
  Year smallint,
  Make varchar(150),
  Model varchar(150)
);`;

const createTables = async () => {
  const pool = new Pool(poolConfig);
  try {
    await pool.connect();
    const userTable = await pool.query(createUserTableQuery);
    const vehicleTable = await pool.query(createVehicleTableQuery);
    console.log(userTable);
    console.log(vehicleTable);
    pool.end();
  } catch (error) {
    console.log('There was an error establishing tables.');
    console.log(error);
    pool.end();
  }
};

const dropTable = async (tableName) => {
  const client = new Client(clientConfig);
  try {
    await client.connect();
    const tableDrop = await client.query(`DROP TABLE ${tableName}`);
    console.log(tableDrop);
    client.end();
  } catch (error) {
    console.log('There was an error dropping the table.');
    console.log(error);
    client.end();
  }
};



const seed = async () => {
  await toggleDb(false)
  await toggleDb(true);
  await createTables();
};

seed();
  
