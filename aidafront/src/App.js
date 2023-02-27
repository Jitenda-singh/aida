import React, { useEffect } from 'react'
import './App.css'
import { Amplify, Hub } from 'aws-amplify';
import awsConfigJs from './aws-config/awsconfig';
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import AppRouter from './AppRouter';
import { useDispatch } from 'react-redux'
import { setUser } from './reducers/userReducer'
Amplify.configure(awsConfigJs)

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      console.log("hub==>", event, data)
      switch (event) {
        case 'signIn':
          console.log('sign in', event, data)
          dispatch(setUser({ token: data, isAuthenticated: true }))
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