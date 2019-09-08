// Requires:
const adjetiveisor = require('adjetiveisor')
const h = require('../helpers')

// Import adjectives:
const translators = require('../translators.json')

const genericTranslator = adjetiveisor()

const checkTranslator = (req, res) => {
  if (typeof translators[req.params.adjective] === 'undefined') {
    const responseText = `Translation not configured: ${req.params.adjective}`
    console.warn(responseText)
    const fail = h.apiFail(400, responseText)
    res.status(400).send(fail)
    return false
  }
  return true
}

exports.usage = (req, res) => {
  if (!checkTranslator(req, res)) return false

  const apiDefinition = {
    api: {
      name: req.params.adjective,
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
  if (!checkTranslator(req, res)) return false

  if (typeof req.body.text !== 'string') {
    const fail = h.apiFail(400, 'Bad Request: you need to provide text param')
    res.status(400).send(fail)
    return
  }

  // Config the translator for that adjective:
  genericTranslator.config(translators[req.params.adjective])

  try {
    const text = req.body.text
    const verbose = req.body.verbose || false
    if (verbose === true) {
      genericTranslator.verbose(true)
    } else {
      genericTranslator.verbose(false)
    }
    const textTranslated = genericTranslator.translate(text)
    const data = {
      text,
      translation: textTranslated,
      translator: req.params.adjective
    }
    const result = h.apiResponse(data)
    res.status(200).send(result)
  } catch (e) {
    const fail = h.apiFail()
    res.status(500).send(fail)
    console.log(e)
  }
}

exports.getTranslators = (req, res) => {
  const translatorsList = Object.keys(translators)
  const response = h.apiResponse(translatorsList)
  res.status(200).send(response)
}
