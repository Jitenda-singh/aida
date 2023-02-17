import React from 'react'
import urlConstants from '../constants/urlConstants'
export default function Login() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      You are not logged in&nbsp;
      <a href={`https://${process.env.REACT_APP_COGNITO_DOMAIN}/login?response_type=code&client_id=${process.env.REACT_APP_COGNITO_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_API_REDIRECT_URL + urlConstants.welcome}`}>Sign in</a>
    </div>
  )
}