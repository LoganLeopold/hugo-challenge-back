const express = require('express');
const { Pool, Client } = require('pg');
const { seed } = require('./db/seeding/seeder');
const inserts = require('./db/utils/inserts');
const queries = require('./db/utils/queries');
const dotenv = require('dotenv');

// establish server
const server = express();
server.use(express.json())
dotenv.config();

server.get('/test', async (req, res) => {
  res.json({data: "Saaaaah brah"});
});

// new application - returns resume route
server.post('/application', async (req, res) => {
  try {
    const newCustomer = await inserts.addCustomer(Object.values(req.body.data.customer));
    const newVehicle = await inserts.addVehicle(Object.values(req.body.data.vehicle));
    const newApplication = await inserts.addApplication();
    const newCustomerVehicleBind = await inserts.addCustomerVehicleBind(newCustomer, newVehicle);
    const newCustomerApplicationBind = await inserts.addCustomerApplicationBind(newCustomer, newApplication);
    const newVehicleApplicationBind = await inserts.addVehicleApplicationBind(newVehicle, newApplication);
    res.send(
      "Resume link here"
    );
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

server.listen(process.env.APP_PORT, async () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
});

module.exports = { server }