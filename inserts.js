const { Pool, Client } = require('pg');

// const clientConfig = {
//   host: process.env.PGHOST,
//   user: process.env.PGUSER,
//   password: process.env.PGPASSWORD,
//   port: process.env.PGPORT,
// };

const poolConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.TARGET_DB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

const tryTables = async () => {
  const pool = new Pool(poolConfig);
  const tryTables = `
  SELECT *
  FROM pg_catalog.pg_tables;
 `;
 try {
  const tables = await pool.query(tryTables);
  console.log(tables);
  pool.end();
  return tables;
 } catch (error) {
  console.log(error);
  pool.end();
  return error;
 }
}

const addCustomer = async (values) => {
  console.log('addCustomer');
  const pool = new Pool(poolConfig);
  const insertCustomerQuery = `
  INSERT INTO customers (
    lastname,
    firstname,
    birthday,
    street,
    city,
    state,
    zipcode
  ) 
  VALUES ($1, $2, $3, $4, $5, $6, $7)
  RETURNING customer
`;
  try {
    const customerAdd = await pool.query(insertCustomerQuery, values);
    console.log(customerAdd.rows[0].customer);
    pool.end();
    return customerAdd.rows[0].customer;
  } catch (error) {
    pool.end();
    console.log("CUSTOMER ERROR");
    return error; 
  };
}

const addVehicle = async (values) => {
  const pool = new Pool(poolConfig);
  const insertVehicleQuery = `
  INSERT INTO vehicles ( 
    vin,
    year,
    make,
    model
  )
  VALUES ($1, $2, $3, $4)
  RETURNING vin
`;
  try {
    const vehicleAdd = await pool.query(insertVehicleQuery, values);
    console.log(vehicleAdd.rows[0].vin);
    pool.end();
    return vehicleAdd.rows[0].vin;
  } catch (error) {
    console.log("VEHICLE ERROR");
    pool.end();
    return error; 
  };
}

const addCustomerVehicleBind = async (customer, vin) => {
  const pool = new Pool(poolConfig);
  const insertCustomerVehicleBind = `
    INSERT INTO user_vehicle (
      customer, 
      vin
    )
    VALUES ($1, $2)
    RETURNING customer, vin
  `;
  try {
    const customerVehicleAdd = await pool.query(insertCustomerVehicleBind, [customer, vin]);
    console.log(customerVehicleAdd);
    pool.end();
    return customerVehicleAdd;
  } catch (error) {
    console.log(error);
    pool.end();
    return error;
  };
}

module.exports = {
  addCustomer,
  addVehicle,
  addCustomerVehicleBind,
  tryTables
}