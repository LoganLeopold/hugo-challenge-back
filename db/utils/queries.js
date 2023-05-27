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

const getApplicationData = async (applicationId) => {
  const pool = new Pool(poolConfig);
  const getAppCustomerQuery = `
    SELECT * 
    FROM customers c
      JOIN customer_application c_a ON c.customer = c_a.customer AND c_a.application = '${applicationId}';
  `;
  const getAppVehicleQuery = `
    SELECT * 
    FROM vehicles v
      JOIN vehicle_application v_a ON v.vin = v_a.vin AND v_a.application = '${applicationId}';
  `
  try {
    const customer = await pool.query(getAppCustomerQuery);
    const vehicle = await pool.query(getAppVehicleQuery);
    return {
      customer: customer.rows[0],
      vehicles: vehicle.rows,
      application: customer.rows[0].application
    }
  } catch (error) {
    console.log("GET APPLICATION ERROR");
    console.log(error);
    return error;
  }
}

const getAllApplications = async() => {
  const pool = new Pool(poolConfig);
  const getAllAppsQuery = `
    SELECT * 
    FROM customer_application c_a
      JOIN customers c ON c_a.customer = c.customer
  `;
  try {
    const allApps = await pool.query(getAllAppsQuery)
    return allApps;
  } catch (error) {
    return error;
  }
}

module.exports = {
  getApplicationData,
  getAllApplications
}