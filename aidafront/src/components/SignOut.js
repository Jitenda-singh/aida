import React from 'react'
import Login from './Login'

function SignOut() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Logout Successfully.&nbsp;
      <Login isSignOut={true}/>
    </div>
  )
}

export default SignOut