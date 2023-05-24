const { Pool, Client } = require('pg');
const { 
  addCustomer, 
  addCustomerVehicleBind, 
  addVehicle 
} = require('./inserts');
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

const establishUuidsQuery = `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;

// base table queries 
const createCustomerTableQuery = `CREATE TABLE IF NOT EXISTS customers (
  lastname varchar(255),
  firstname varchar(255),
  birthday varchar(10),
  street varchar(255),
  city varchar(255),
  state varchar(75),
  zipcode int,
  customer uuid DEFAULT uuid_generate_v4(),
  CONSTRAINT p_key PRIMARY KEY (customer)
);`;

const createVehicleTableQuery = `CREATE TABLE IF NOT EXISTS vehicles (
  vin varchar(225) PRIMARY KEY,
  year smallint,
  make varchar(150),
  model varchar(150)
);`;

const createUserVehicleJoin = `CREATE TABLE user_vehicle (
  customer uuid,
  vin varchar(225),
  PRIMARY KEY (customer, vin),
  CONSTRAINT k_user FOREIGN KEY(customer) REFERENCES customers(customer),
  CONSTRAINT k_vin FOREIGN KEY(vin) REFERENCES vehicles(vin)
);`;

const createTables = async () => {
  const pool = new Pool(poolConfig);
  try {
    await pool.connect();
    const uuidAddition = await pool.query(establishUuidsQuery);
    const userTable = await pool.query(createCustomerTableQuery);
    const vehicleTable = await pool.query(createVehicleTableQuery);
    const userVehicleJoin = await pool.query(createUserVehicleJoin);
    pool.end();
  } catch (error) {
    console.log('There was an error establishing tables.');
    console.log(error);
    pool.end();
  }
};

const insertCustomerValues = [
  'Leopold',
  'Logan',
  '09/24/1990',
  '319 10th ST SE APT 1',
  'Washington',
  'District of Columbia',
  20003
]

const insertVehicleValues = [
  'TJ45HJKJHJK123432',
  '2010',
  'Honda',
  'Insight'  
]

const seed = async () => {
  console.log("SEEEEED");
  await toggleDb(false);
  await toggleDb(true);
  await createTables();

  // const customerUuid = await addCustomer(insertCustomerValues);
  // const vin = await addVehicle(insertVehicleValues);
  // const customerVehicleBind = await addCustomerVehicleBind(customerUuid, vin);
  // console.log(customerVehicleBind);
  console.log("EEEEEEEND SEEEEEED");
};

module.exports = { seed };


