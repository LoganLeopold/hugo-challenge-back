const { server, testPost } = require('./server');
const { seed } = require('./seeding');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config()

const app = async () => {
  await seed();
  const test = await testPost();
  console.log(test)
}

app();

