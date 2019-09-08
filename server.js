const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/index')
const h = require('./helpers')

const server = express()

//Make life more difficult for hackers that don't read Github
server.disable('x-powered-by');

server.use(cors())
server.use(bodyParser.json())
server.use('/', router)

server.use(h.productionErrors)

const port = process.env.PORT || 8000
server.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
