exports.apiResponse = (data) => {
  let filteredData
  if (data && typeof data === 'object') filteredData = [data]
  if (data && Array.isArray(data)) filteredData = data
  if (!data) filteredData = []

  let n = (Array.isArray(filteredData)) ? filteredData.length : 0

  const response = {
    result: {
      status: 'OK',
      code: 200,
      count: n
    },
    data: filteredData
  }

  const jsonResponse = JSON.stringify(response)
  return jsonResponse
}

const apiFail = (code, msg) => {
  const errorCode = code || 500
  const text = (typeof msg === 'string') ? msg : 'Internal server error'
  const response = {
    result: {
      status: 'KO',
      code: errorCode,
      error: text
    },
    data: []
  }

  const jsonResponse = JSON.stringify(response)
  return jsonResponse
}

exports.apiFail = apiFail

exports.productionErrors = (err, req, res, next) => {
  const errorCode = err.status || 500
  res.status(errorCode)
  const response = apiFail(errorCode, err.message)
  res.send(response)
}
