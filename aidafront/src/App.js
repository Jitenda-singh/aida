import React, { useEffect } from 'react'
import './App.css'
import { Amplify, Hub } from 'aws-amplify';
import awsConfigJs from './aws-config/awsconfig';
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import AppRouter from './AppRouter';
import { useDispatch } from 'react-redux'
import { setUser } from './reducers/userReducer'
import { get } from './utils/httpHelper';
import { API } from 'aws-amplify'
import constants from './constants/constants';

Amplify.configure(awsConfigJs)

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    Hub.listen('auth', async ({ payload: { event, data } }) => {
      console.log("hub==>", event, data)
      switch (event) {
        case 'signIn':
          console.log('sign in', event, data)
          const requestData = {
            headers: {
              Authorization: data.signInUserSession.idToken.jwtToken
            }
          }
          const userData = await API.get(constants.REACT_APP_AIDA_API_NAME, '/user', requestData)
          dispatch(setUser({ token: data, isAuthenticated: true, userData: userData }))
          break
        case 'signOut':
          console.log('sign out')
          dispatch(setUser({ token: {}, isAuthenticated: false }))
          break
        default:
          break;
      }
    })
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <AppRouter />
      </div>
    </ThemeProvider>
  )
}

export default App