import React from 'react'
import urlConstants from '../constants/urlConstants'
import Button from './Button'
export default function Login(props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "30px" }}>
      {props.isSignOut ? <>
        Please&nbsp;<a href={`https://${process.env.REACT_APP_COGNITO_DOMAIN}/login?response_type=code&client_id=${process.env.REACT_APP_COGNITO_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_API_REDIRECT_URL + urlConstants.welcome}`}>Sign in</a>&nbsp;again.
      </>
        :
        <>
          You are not signed in&nbsp;
          <a href={`https://${process.env.REACT_APP_COGNITO_DOMAIN}/login?response_type=code&client_id=${process.env.REACT_APP_COGNITO_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_API_REDIRECT_URL + urlConstants.welcome}`}>Sign in</a>
        </>
      }
    </div>
  )
}