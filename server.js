const express = require('express');
const { seed } = require('./seeding');
const { Pool, Client } = require('pg');
const { 
  addCustomer, 
  addCustomerVehicleBind, 
  addVehicle, 
  tryTables
} = require('./inserts');
const axios = require('axios');
const dotenv = require('dotenv');

// establish server
const server = express();
server.use(express.json())
dotenv.config();

server.get('/test', async (req, res) => {
  res.json({data: "Saaaaah brah"});
});

const poolConfig = {
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  database: process.env.TARGET_DB,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
};

// new application - returns resume route
server.post('/application', async (req, res) => {
  const newCustomer = await addCustomer(Object.values(req.body.data.customer));
  res.send(
    "Resume link here"
  );
});

const testCustomerData = {
  lastname: 'Leopold',
  firstname: 'Logan',
  birthday: '09/24/1990',
  street: '319 10th ST SE APT 1',
  city: 'Washington',
  state: 'District of Columbia',
  zipcode: 20003
};

const testVehicleData = {
  vin: 'TJ45HJKJHJK123432', 
  year: '2010', 
  make: 'Honda', 
  model: 'Insight'  
};

server.listen(process.env.APP_PORT, async () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
});

const testPost = async () => {
  console.log("TEST POST");
  let res = await axios.post('http://localhost:3001/application', {
    data: {
      customer: testCustomerData,
      vehicle: testVehicleData
    }
  });
};

module.exports = { server, testPost }