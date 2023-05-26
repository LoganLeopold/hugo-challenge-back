const { Pool, Client } = require('pg');
const dotenv = require('dotenv');
const { all } = require('axios');
dotenv.config();

const poolConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.TARGET_DB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

const createSetStatement = (keyValues) => {
  return Object.keys(keyValues).reduce((acc, curr, i, arr) => {
    acc += curr + " = $" + (i+1) ;
    if (i != arr.length - 1) acc+= ', ';
    return acc;
  }, '');
};

const createReturnStatement = (keyValues) => {
  return Object.keys(keyValues).reduce((acc, curr, i, arr) => {
    acc += curr;
    if (i != arr.length - 1) acc+= ', ';
    return acc;
  }, '');
};

const updateCustomer = async (uuid, keyValues) => {
  const pool = new Pool(poolConfig);
  const setStatement = createSetStatement(keyValues);
  const returnStatement = createReturnStatement(keyValues);
  const updateCustomerQuery = `UPDATE customers
    SET ${setStatement}
    WHERE customer = $${Object.keys(keyValues).length + 1}
    RETURNING ${returnStatement}
  `;
  try {
    const updatedCustomer = await pool.query(updateCustomerQuery, [...Object.values(keyValues), uuid]);    
    if (updatedCustomer.rows.length > 0) {
      console.log(updatedCustomer.rows[0]);
      return updatedCustomer.rows[0];
    };
    // console.log(updatedCustomer);
  } catch (error) {
    return error;
  }
};

const updateVehicle = async (vin, keyValues) => {
  const pool = new Pool(poolConfig);
  const setStatement = createSetStatement(keyValues);
  const returnStatement = createReturnStatement(keyValues);
  const updateVehicleQuery = `UPDATE vehicles
    SET ${setStatement} 
    WHERE vin = $${Object.keys(keyValues).length + 1}
    RETURNING ${returnStatement}
  `;
  try {
    const updatedVehicle = await pool.query(updateVehicleQuery, [...Object.values(keyValues), vin]);
    if (updatedVehicle.rows.length > 0) {
      return updatedVehicle.rows[0];
    }
  } catch (error) {
    return error;
  }
}

module.exports = {
  updateCustomer,
  updateVehicle
}
