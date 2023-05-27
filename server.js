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

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT");
  next();
})

// get all applications
server.get('/applications/all', async (req,res) => {
  try {
    const allApps = await queries.getAllApplications();
    res.json(allApps.rows)
  } catch (error) {
    res.send(error);
  };
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
  const applicationId = req.params.id;
  try {
    const applicationData = await queries.getApplicationData(applicationId);
    res.json(applicationData);
  } catch (error) {
    res.json(error);
  };
});

server.put('/application/:id', async (req, res) => {
  // const id = req.params.id;
  /*
    req.body: Arrays by document type containing documents by uuid/vin and their row updates (as keyValues).
    ** At the moment - FE is onyl sending one ~customer~
    ** At the moment - FE is only sending one key-value update per document at a time (Object.keys(keyValue).length === 1)
    {
      customer: [ { customer: customerUuid, keyValues: { key: value, key: value } } ]
      vehicles: [ { vin: vin,           keyValues: { key, value             } } ]
    }
  */ 
  try {
    const { customer, vehicles } = req.body;
    
      let updatedCustomer, updatedVehicles, returnObj = {};
      if (customer) {
        let thisCustomer = customer[0]
        updatedCustomer = await updates.updateCustomer(thisCustomer.customer, thisCustomer.keyValues);
        returnObj['customer'] = updatedCustomer;
      };
      if (vehicles) {
        updatedVehicles = await Promise.all(vehicles.map( async vehicle => 
          await updates.updateVehicle(vehicle.vin, vehicle.keyValues) 
        ));
        returnObj['vehicles'] = updatedVehicles;
      };
      res.send(returnObj);
  } catch (error) {
    res.send(error);
  }
})

server.listen(process.env.APP_PORT, async () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
});

module.exports = { server };