import axios from 'axios'

export const getUri = (uri, params, queryParams) => {
  let newUri = uri

  if (params) {
    for (const param of params) {
      newUri = newUri.replace(param.param, param.value)
    }
  }
  if (queryParams) {
    const url = new URL(
      newUri,
      process.env.REACT_APP_API_URL
    )
    const qParams = new URLSearchParams(url.search.slice(1))
    for (const [key, value] of Object.entries(queryParams)) {
      if (value && Array.isArray(value)) {
        for (const value1 of value) {
          qParams.append(key, JSON.stringify(value1))
        }
      } else if (value && typeof value === 'object') {
        qParams.append(key, JSON.stringify(value))
      } else {
        qParams.append(key, value)
      }
    }
    url.search = qParams.toString()
    newUri = url.toString()
    newUri = newUri.replace(process.env.REACT_APP_API_URL, '')
  }
  return process.env.REACT_APP_API_URL + newUri
}

export const get = async (uri, params, queryParams, headers) => {
  return await axios.get(getUri(uri, params, queryParams), headers)
}