const express = require('express');
const { Pool, Client } = require('pg');
const inserts = require('./db/utils/inserts');
const queries = require('./db/utils/queries');
const updates = require('./db/utils/updates')
const dotenv = require('dotenv');
const { validateApp } = require('./db/utils/validations');

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

/*
  GETS
*/
// get all applications
server.get('/applications/all', async (req,res) => {
  try {
    const allApps = await queries.getAllApplications();
    res.json(allApps.rows)
  } catch (error) {
    res.send(error);
  };
});

// get an individual application
server.get('/application/:id', async (req, res) => {
  const applicationId = req.params.id;
  try {
    const applicationData = await queries.getApplicationData(applicationId);
    res.json(applicationData);
  } catch (error) {
    res.json(error);
  };
});


/*
  POSTS
*/
// new application - returns resume route
server.post('/application/new', async (req, res) => {
  try {
    const newApp = inserts.addApplicationWhole(req.body.data.customer, req.body.data.vehicles);
    res.json({data: `http://127.0.0.1:3000/application:${newApp}`});
  } catch (error) {
    res.send(error);
  }
});

server.post('/application/submit', async (req, res) => {
  try {
    const valid = validateApp(req.body.data);
    if (valid) { res.send(Math.random() * 100) }
    else { return {error: "Some fields are not valid."}}
  } catch (error) { 
    res.send(error);
  }
})

/* 
  PUTS
*/

// Update an application by fields
server.put('/application/:id', async (req, res) => {
  /*
    req.body: Arrays by document type containing documents by uuid/vin and their row updates (as keyValues).
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

server.put('/customer/:id', async (req, res) => {
  const updatedCustomer = await updates.updateCustomer(req.params.id, req.body);
  res.json(updatedCustomer)
})

server.put('/vehicle/:id', async (req, res) => {
  const updatedVehicle = await updates.updateVehicle(req.params.id, req.body);
  res.json(updatedVehicle);
})


server.listen(process.env.APP_PORT, async () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
});

module.exports = { server };