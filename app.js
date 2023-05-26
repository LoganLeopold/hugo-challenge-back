const { server } = require('./server');
const { seed } = require('./db/seeding/seeder');
const queries = require('./db/utils/queries');
const data = require('./db/seeding/seeds/documents');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config()

const testPost = async () => {
  console.log("TEST POST");
  let res = await axios.post('http://localhost:3001/application/new', {
    data: {
      customer: data.insertCustomerValues1,
      vehicle: data.insertVehicleValues1
    }
  });
  console.log(res.data);
};

const testGet = async (applicationId) => {
  console.log("testGet");
  let res = await axios.get(`http://localhost:3001/application/${applicationId}`);
  return res;
}

const testCustomerReqObject = {
  uuid: '724f9e3e-613e-4c91-b4d2-bc857ca12a8d',
  keyValues: {
    firstName: "RobertThree"
  }
};
const testVehicleReqObject1 = {
  vin: 'TOYAVENUE',
  keyValues: {
    year: 2020
  }
};
const testVehicleReqObject2 = {
  vin: "WALDENPOND",
  keyValues: {
    year: 1950
  }
};

const testUpdate = {
  customer: testCustomerReqObject,
  vehicles: [testVehicleReqObject1, testVehicleReqObject2]
};

const testPut = async (update) => {
  const applicationId = "a7210f38-33b6-4dd9-a91a-a3af9f848f24";
  
  let res = await axios.put(`http://localhost:3001/application/${applicationId}`, {data: update});
  return res.data
}

const app = async () => {
  // await seed();  
  
  const completedTestUpdate = await testPut(testUpdate);
}

app();

