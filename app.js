const server = require('./server');
const seed = require('./seeding');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config()

DeviceMotionEvent.co
const testApi = async () => {
  let res = await axios.get('http://localhost:3001/test');
  console.log(res.data);
};

// testApi();