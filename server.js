const express = require('express');
const dotenv = require('dotenv');

// establish server
const server = express();
dotenv.config();

server.get('/test', async (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.json({data: "Saaaaah brah"});
})

server.listen(process.env.APP_PORT, async () => {
  console.log(`Example app listening on port ${process.env.APP_PORT}`);
});

module.exports = { server }

