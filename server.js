const express = require('express');
const { Pool, Client } = require('pg');
const { seed } = require('./db/seeding/seeder');
const inserts = require('./db/utils/inserts');
const queries = require('./db/utils/queries');
const updates = require('./db/utils/updates');
const dotenv = require('dotenv');

// establish server
const server = express();
server.use(express.json())
dotenv.config();

server.get('/test', async (req, res) => {
  res.json({data: "Saaaaah brah"});
});

// new application - returns resume route
server.post('/application/new', async (req, res) => {
  try {
    const newApp = inserts.addApplicationWhole(req.body.data.customer, req.body.data.vehicles);
    res.json({data: newApp});
  } catch (error) {
    res.send(error);
  }
});

server.get('/application/:id', async (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  const applicationId = req.params.id;
  try {
    const applicationData = await queries.getApplicationData(applicationId);
    res.json(applicationData);
  } catch (error) {
    res.json(error);
  };
});

server.put('/application/:id', async (req, res) => {
  const { customer, vehicles } = req.body.data;
  const id = req.params.id;

  let updatedCustomer, updatedVehicles, returnObj = {};
  if (customer) {
    updatedCustomer = await updates.updateCustomer(customer.uuid, customer.keyValues);
    returnObj['customer'] = updatedCustomer;
  };
  if (vehicles) {
    updatedVehicles = await Promise.all(vehicles.map( async vehicle => 
      await updates.updateVehicle(vehicle.vin, vehicle.keyValues) 
    ));
    // console.log(updatedVehicles, "updatedVehicles");
    returnObj['vehicles'] = updatedVehicles;
  };

  console.log(returnObj);
})

server.listen(process.env.APP_PORT, async () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
});

module.exports = { server }