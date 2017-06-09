const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index');

require('dotenv').config();

const server = express();

server.use(bodyParser.json());
server.use('/', router);

const port = process.env.SERVER_PORT || 8000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

