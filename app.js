const { server, testPost } = require('./server');
const { seed } = require('./seeding');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config()

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

const app = async () => {
  // await seed();
  // server.listen(process.env.APP_PORT, async (err) => {
  //   if (err) { 
  //     console.log(err)
  //   } else {
  //     console.log(`Example app listening on port ${process.env.APP_PORT}`);
  //   }
  // });
  // const test = await axios.post('http://localhost:3001/application', {
  //   data: {
  //     customer: testCustomerData,
  //     vehicle: testVehicleData
  //   }
  // });
  // console.log(test);
  const test = testPost();
}

app();

