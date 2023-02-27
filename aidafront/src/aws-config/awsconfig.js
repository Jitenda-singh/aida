import constants from "../constants/constants"
import { Auth } from 'aws-amplify'

export default {
  Auth: {
    identityPoolId: process.env.REACT_APP_COGNITO_IDENTITY_POOL_ID,
    mandatorySignIn: false,
    region: process.env.REACT_APP_COGNITO_REGION,
    userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,
    authenticationFlowType: process.env.REACT_APP_COGNITO_AUTHENTICATION_FLOW,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN,
      scope: ['email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: `${process.env.REACT_APP_API_REDIRECT_URL}/welcome`,
      redirectSignOut: `${process.env.REACT_APP_API_REDIRECT_URL}/sign-out`,
      responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
    }
  },
  API: {
    endpoints: [
      {
        name: constants.AIDA_API,
        endpoint: process.env.REACT_APP_API_URL,
        region: process.env.REACT_APP_COGNITO_REGION,
        custom_header: async () => {
          try {
            const currentSession = await Auth.currentSession()
            return {
              Authorization: `Bearer ${currentSession.idToken.jwtToken}`
            }
          } catch (e) {
            return {}
          }
        }
      }
    ]
  }
}