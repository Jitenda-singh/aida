import React from 'react'
import urlConstants from '../constants/urlConstants'
import { Auth } from 'aws-amplify'
import Button from '@mui/material/Button';

export default function SignIn(props) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: "30px" }}>
      {props.isSignOut ? <>
        <Button variant="contained" onClick={() => Auth.federatedSignIn()}>Sign In</Button>
      </>
        :
        <>
          You are not signed in.
          <Button variant="contained" onClick={() => Auth.federatedSignIn()}>Sign In</Button>
        </>
      }
    </div>
  )
}