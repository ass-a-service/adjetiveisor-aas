const adjetiveisor = require('adjetiveisor')
const h = require('../helpers')

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
  } catch (e) {
    const fail = h.apiFail()
    res.status(500).send(fail)
    console.log(e)
  }
}
