import urlConstants from '../constants/urlConstants'
import axios from 'axios'

export const getToken = async (code) => {
  const params = new URLSearchParams();
  params.append("grant_type", 'authorization_code');
  params.append("code", code);
  params.append("client_id", process.env.REACT_APP_COGNITO_APP_CLIENT_ID);
  params.append("redirect_uri", process.env.REACT_APP_API_REDIRECT_URL + urlConstants.welcome);
  const { data } = await axios.post(`https://${process.env.REACT_APP_COGNITO_DOMAIN}${urlConstants.getCognitoOauth2Token}`, params)
  return data
}