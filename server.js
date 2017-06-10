const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/index')
const h = require('./helpers')

require('dotenv').config()

const server = express()

server.use(cors())
server.use(bodyParser.json())
server.use('/', router)

server.use(h.productionErrors)

const port = process.env.SERVER_PORT || 8000
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
