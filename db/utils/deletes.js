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

const deleteVehicle = async (id) => {
  const pool = new Pool(poolConfig);
  const deleteVehicleQuery = `DELETE FROM vehicles
    WHERE vin = $1
  `;
  try {
    const deletedVehicle = await pool.query(deleteVehicleQuery, [id]);
  } catch (error) {
    console.log(error);
    return error;
  }
}

module.exports = {
    deleteVehicle
  }