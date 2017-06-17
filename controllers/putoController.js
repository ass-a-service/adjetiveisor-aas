const adjetiveisor = require('adjetiveisor')
const logger = require('loggeraas-node-wrapper')
const h = require('../helpers')

require('dotenv').config()

const loggerConfig = {
  host: process.env.LOGGER_HOST,
  path: process.env.LOGGER_PATH,
  port: process.env.LOGGER_PORT,
  hash: process.env.LOGGER_HASH,
  enabled: (process.env.LOGGER_ENABLED === 'true'), // this is required because dotenv doesn't accept boolean params
  verbose: (process.env.LOGGER_VERBOSE === 'true')
}

const l = logger(loggerConfig)

const putoTranslator = adjetiveisor()
const config = {
  ms: 'puto',
  mp: 'putos',
  fs: 'puta',
  fp: 'putas'
}

const translator = 'puto'

putoTranslator.config(config)

exports.usage = (req, res) => {
  const apiDefinition = {
    api: {
      name: 'puto translator',
      base_url: `${req.protocol}://${req.hostname}${req.path}`,
      endpoints: [
        {
          method: 'GET',
          path: req.path,
          params: []
        },
        {
          method: 'POST',
          path: req.path,
          params: [
            { name: 'text', type: 'string', required: true },
            { name: 'verbose', type: 'boolean', required: false }
          ]
        }
      ]
    }
  }
  const data = apiDefinition
  const result = h.apiResponse(data)
  res.status(200).send(result)
}

exports.translate = (req, res) => {
  if (typeof req.body.text !== 'string') {
    const fail = h.apiFail(400, 'Bad Request: you need to provide text param')
    res.status(400).send(fail)
    return
  }
  try {
    const text = req.body.text
    const verbose = req.body.verbose || false
    if (verbose === true) {
      putoTranslator.verbose(true)
    } else {
      putoTranslator.verbose(false)
    }
    const textTranslated = putoTranslator.translate(text)
    const data = {
      text,
      translation: textTranslated,
      translator
    }
    const result = h.apiResponse(data)
    res.status(200).send(result)
    l.log({ input: data.text, output: data.translation, translator: data.translator }) // only logs succesful requests
  } catch (e) {
    const fail = h.apiFail()
    res.status(500).send(fail)
    console.log(e)
  }
}
