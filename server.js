const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

// establish server
const server = express();
dotenv.config();

server.get('/test', async (req, res) => {
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.json({data: "Saaaaah brah"});
})

// new application - returns resume route
server.post('/application', async (req, res) => {

})

server.listen(process.env.APP_PORT, async () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
});

module.exports = { server }

const testApi = async () => {
  let res = await axios.get('http://localhost:3001/test');
  console.log(res.data);
};

testApi();
