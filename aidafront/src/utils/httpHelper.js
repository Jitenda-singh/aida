// import axios from 'axios'
import { API } from 'aws-amplify'
import constants from '../constants/constants'

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

// export const get = async (uri, params, queryParams, headers) => {
//   return await axios.get(getUri(uri, params, queryParams), headers)
// }
export const post = async(uri, postBody)=>{
  try {
    const response = await API.post(constants.REACT_APP_AIDA_API_NAME, uri, postBody)
    return response
  } catch (e) {
    throw e
  }
}
export const get = async (uri, init) => {
  try {
    const response = await API.get(constants.REACT_APP_AIDA_API_NAME, uri, init)
    return response
  } catch (e) {
    // await helper.handleUnauthorizedError(e)
    throw e
  }
}

