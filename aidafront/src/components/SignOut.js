import React from 'react'
import Login from './SignIn'

function SignOut() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Login isSignOut={true}/>
    </div>
  )
}

export default SignOut