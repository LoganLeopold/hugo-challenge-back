const { Pool, Client } = require('pg');
const { 
  addCustomer, 
  addCustomerVehicleBind, 
  addVehicle, 
  tryTables,
  addApplicationWhole,
  addCustomerApplicationBind,
  addVehicleApplicationBind
} = require('../utils/inserts');
const seedData = require('./seeds/documents');
const tables = require('./seeds/tables');
const dotenv = require('dotenv');
dotenv.config();
  
const clientConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};
const poolConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.TARGET_DB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

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
};

const createTables = async () => {
  const pool = new Pool(poolConfig);
  try {
    await pool.connect();
    // Could be done programatically
    const uuidAddition = await pool.query(tables.establishUuidsQuery);
    const customerTable = await pool.query(tables.createCustomerTableQuery);
    const vehicleTable = await pool.query(tables.createVehicleTableQuery);
    const applicationTable = await pool.query(tables.createApplicationTableQuery);
    const customerVehicleJoin = await pool.query(tables.createCustomerVehicleJoin);
    const customerApplicationJoin = await pool.query(tables.createCustomerApplicationJoin);
    const vehicleApplicationJoin = await pool.query(tables.createVehicleApplicationJoin);
    pool.end();
  } catch (error) {
    console.log('There was an error establishing tables.');
    console.log(error);
    pool.end();
  }
};

const seed = async () => {
  console.log("SEEEEED");
  await toggleDb(false);
  await toggleDb(true);
  await createTables();

  await addApplicationWhole(seedData.insertCustomerValues1, [seedData.insertVehicleValues1]);
  await addApplicationWhole(seedData.insertCustomerValues2, [seedData.insertVehicleValues2]);
  await addApplicationWhole(seedData.insertCustomerValues3, [seedData.insertVehicleValues3, seedData.insertVehicleValues4]);
  console.log("EEEEEEEND SEEEEEED");
};

module.exports = { seed };


