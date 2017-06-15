const https = require('https')

exports.Log = async (original_string, translated_string) => {
  //If process.env.LOGGER_ENABLED is not defined or false, we go away
  if (!process.env.LOGGER_ENABLED || process.env.LOGGER_ENABLED != 'true') {
    return {'logged': false, 'msg': 'Logger not enabled. Set LOGGER_ENABLED environment variable to true'}
  }

  //We only want to log strings. What a surprise here!
  if (typeof original_string !== 'string' || typeof translated_string !== 'string') {
    return {'logged': false, 'msg': 'Input parameters need to be string'}
  }

  //If process.env.LOGGER_HASH is not enabled, we go away
  if (!process.env.LOGGER_HASH) {
    return {'logged': false, 'msg': 'LOGGER_HASH environment variable is not set'}
  }

  let post_data = JSON.stringify({
    'hash': process.env.LOGGER_HASH,
    'text': JSON.stringify({'input': original_string, 'output': translated_string})
  });

  let post_options = {
    host: process.env.LOGGER_HOST || 'logger.assa.services',
    port: process.env.LOGGER_PORT || '443', //Better safe than sorry, I guess
    path: process.env.LOGGER_PATH || '/api/v1/logs',
    method: 'POST',
    headers : {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(post_data)
    }
  };

  let post_req = https.request(post_options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
      if (process.env.LOGGER_VERBOSE && process.env.LOGGER_VERBOSE === 'true') {
        console.log('Logger response: '+chunk)
      }
      return {'logged': res.statusCode === 200}
    })
  })

  post_req.write(post_data)
  post_req.end()

}
