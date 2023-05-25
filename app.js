const { server } = require('./server');
const { seed } = require('./db/seeding/seeder');
const queries = require('./db/utils/queries');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config()

const testPost = async () => {
  console.log("TEST POST");
  let res = await axios.post('http://localhost:3001/application', {
    data: {
      customer: testCustomerData,
      vehicle: testVehicleData
    }
  });
  // console.log(res.data);
};

const testGet = async (applicationId) => {
  console.log("testGet");
  let res = await axios.get(`http://localhost:3001/application/${applicationId}`);
  return res;
}

const app = async () => {
  // await seed();  
  
  const serverGetTest = await testGet('a7210f38-33b6-4dd9-a91a-a3af9f848f24');
  console.log(serverGetTest.data);

  // const test = await queries.getApplicationData('76a567d0-8fd0-47e9-8e39-df3ac2b7cbec');
  // console.log(test);
}

app();

