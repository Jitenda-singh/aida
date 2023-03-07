import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import { makeStyles } from '@mui/styles'
import Container from '@mui/material/Container'
// import { useSelector } from 'react-redux'
// import BackgroundImg from '../assets/img/background.jpg'
import ClippedDrawer from './ClippedDrawer'
import { useSelector } from 'react-redux'
const CustomAppBar = React.lazy(() => import('./CustomAppBar'))
// const AuthHeader = React.lazy(() => import('../components/shared/Header'))

const useStyles = makeStyles((theme) => ({
  layoutBox: {
    position: 'fixed',
    width: '100%',
    height: '100%',
    overflow: 'overlay',
    backgroundColor: theme.palette.white.whitef0f0f0
  },
  authLayoutBox: {
    // backgroundImage: `url(${BackgroundImg})`
  },
  authLayoutSubBox: {
    flexDirection: 'column'
  },
  displayFlex: {
    display: 'flex'
  },
  main: {
    marginTop: '76px',
    width: '100%',
    height: 'calc(100vh - 76px)'
  },
  mainContainer: {
    padding: '24px'
  },
  authMain: {
    width: '100%',
    height: 'calc(100vh - 258px)'
  },
  authContainer: {
    display: 'flex !important',
    flexDirection: 'row',
    justifyContent: 'center',
    minWidth: '400px'
  }
}))

const Layout = () => {
  const classes = useStyles()
  const { isAuthenticated, userData } = useSelector((state) => state.user)
  const showSideBar = userData && userData["cognito:groups"] && userData["cognito:groups"].length > 0 && userData["cognito:groups"].some(item => item.includes("admin-group"))
  return (
    <>
      <Box className={`${classes.layoutBox} ${isAuthenticated ? '' : classes.authLayoutBox}`}>
        <Box className={`${classes.displayFlex} ${isAuthenticated ? '' : classes.authLayoutSubBox}`}>
          <CssBaseline />
          {isAuthenticated && <CustomAppBar />}
          {/* {isAuthenticated && <AuthHeader />} */}
          {isAuthenticated && showSideBar && <ClippedDrawer />}
          <Box component="main" className={`${isAuthenticated ? classes.main : classes.authMain}`}>
            <Container className={`${isAuthenticated ? classes.mainContainer : classes.authContainer}`}>
              <Outlet />
            </Container>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Layout
