import React from 'react'
import Login from './Login'

function SignOut() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Login isSignOut={true}/>
    </div>
  )
}

export default SignOut