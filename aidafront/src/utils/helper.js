import { Auth } from 'aws-amplify'

export const isAuthenticUser = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser()
    console.log("isAuth", (user.signInUserSession && user.signInUserSession.idToken && user.signInUserSession.idToken.jwtToken))
    return (user.signInUserSession && user.signInUserSession.idToken && user.signInUserSession.idToken.jwtToken)
  } catch (error) {
    return false;
  }
}