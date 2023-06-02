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

const tryTables = async () => {
  const pool = new Pool(poolConfig);
  const tryTables = `
  SELECT *
  FROM pg_catalog.pg_tables
  WHERE schemaname != 'pg_catalog' AND 
    schemaname != 'information_schema';
 `;
 try {
  const tables = await pool.query(tryTables);
  console.log(tables);
  return tables;
 } catch (error) {
  console.log(error);
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
    return customerAdd.rows[0].customer;
  } catch (error) {
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
    return vehicleAdd.rows[0].vin;
  } catch (error) {
    console.log("VEHICLE ERROR");
    console.log(error);
    return error; 
  };
}

const addEmptyApplication = async () => {
  const pool = new Pool(poolConfig);
  const insertApplicationQuery = `
  INSERT INTO applications (application)
  VALUES (DEFAULT)
  RETURNING application
`;
  try {
    const applicationAdd = await pool.query(insertApplicationQuery);
    console.log(...Object.entries(applicationAdd));
    return applicationAdd.rows[0].application;
  } catch (error) {
    console.log("APPLICATION ADD ERROR");
    console.log(error);
    return error; 
  };
};

const addCustomerVehicleBind = async (customer, vin) => {
  const pool = new Pool(poolConfig);
  const insertCustomerVehicleBind = `
    INSERT INTO customer_vehicle (
      customer, 
      vin
    )
    VALUES ($1, $2)
    RETURNING customer, vin
  `;
  try {
    const customerVehicleAdd = await pool.query(insertCustomerVehicleBind, [customer, vin]);
    return customerVehicleAdd;
  } catch (error) {
    console.log("CUSTOMER > VEHICLE BIND ERROR");
    console.log(error);
    return error;
  };
}

const addCustomerApplicationBind = async (customer, application) => {
  const pool = new Pool(poolConfig);
  const insertCustomerApplicationBind = `
    INSERT INTO customer_application (
      customer, 
      application
    )
    VALUES ($1, $2)
    RETURNING customer, application
  `;
  try {
    const customerApplicationAdd = await pool.query(insertCustomerApplicationBind, [customer, application]);
    console.log(customerApplicationAdd);
    return customerApplicationAdd;
  } catch (error) {
    console.log("CUSTOMER > APPLICATION BIND ERROR");
    console.log(error);
    return error;
  };
}

const addVehicleApplicationBind = async (vin, application) => {
  const pool = new Pool(poolConfig);
  const insertVehicleApplicationBind = `
    INSERT INTO vehicle_application (
      vin, 
      application
    )
    VALUES ($1, $2)
    RETURNING vin, application
  `;
  try {
    const vehicleApplicationAdd = await pool.query(insertVehicleApplicationBind, [vin, application]);
    console.log(vehicleApplicationAdd);
    return vehicleApplicationAdd;
  } catch (error) {
    console.log("VEHICLE > APPLICATION BIND ERROR");
    console.log(error);
    return error;
  };
}

const bindVehicle = async (vehicleValues, customerUuid, applicationUuid) => {
  const newVehicle = await addVehicle(vehicleValues);
  const newCustomerVehicleBind = await addCustomerVehicleBind(customerUuid, newVehicle);
  const newVehicleApplicationBind = await addVehicleApplicationBind(newVehicle, applicationUuid);
  return newVehicle;
};

const addApplicationWhole = async (customerUuid, vehicleArray) => {
  try {
    const newApplication = await addEmptyApplication();
    const newCustomer = await addCustomer(customerUuid);
    const newCustomerApplicationBind = await addCustomerApplicationBind(newCustomer, newApplication);
    await Promise.all(vehicleArray.map( async vehicleValues => await bindVehicle(vehicleValues, newCustomer, newApplication) ));
    return newApplication;
  } catch (error) {
    return error; 
  }
};

module.exports = {
  addCustomer,
  addVehicle,
  addEmptyApplication,
  addApplicationWhole,
  addCustomerVehicleBind,
  addCustomerApplicationBind,
  addVehicleApplicationBind,
  bindVehicle,
  tryTables,
}