import * as React from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import { makeStyles } from '@mui/styles'
// import { useSelector } from 'react-redux'
import { Auth } from 'aws-amplify'
import { useDispatch } from 'react-redux'
import { setUser } from '../reducers/userReducer'
import constants from '../constants/constants'
import { useLocation } from 'react-router-dom'
// const CustomDialog = React.lazy(() => import('../components/customDialog'))

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'fixed'
  },
  toolbar: {
    maxHeight: '81px',
    // backgroundImage: `url(${BackgroundImg})`
  },
  title: {
    textAlign: 'center',
    fontSize: "3rem !important"
  },
  logo: {
    width: '49px',
    height: '56px',
    marginTop: '-4px'
  },
  flexOne: {
    flex: 1
  },
  signOut: {
    // width: '30px',
    height: '25px',
    color: `${theme.palette.white.whiteffffff} !important`,
    fontSize: '25px',
    marginRight: '-15px !important'
  }
}))

export default function CustomAppBar() {
  // const locationPathName = useSelector((state) => state.navbar.locationPathName)
  const [open, setOpen] = React.useState(false)
  // const headerTitle = Constants.LEFT_MENU.map((item) => locationPathName === item.path && item.headerTitle)
  const classes = useStyles()
  const dispatch = useDispatch()
  const [isView2, setIsView2] = React.useState(false)
  let location = useLocation();
  React.useEffect(() => {
    setIsView2(location.pathname === "/view2")
  }, [location])

  return (
    <AppBar className={classes.toolbar} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar className={classes.toolbar}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{ mr: 2 }}
        >
          {/* <img alt='logo' src={LogoImg} className={classes.logo} loading='lazy' /> */}
          {isView2 ? "" : "AIDA"}
        </IconButton>
        <Typography variant="h1" component="div" className={`${classes.flexOne} ${classes.title}`}>
          {isView2 ? "AIDA Solutions Video Surveillance" : ""}
        </Typography>
        <Button className={classes.signOut} onClick={() => {
          dispatch(setUser({ isAuthenticated: false, action: constants.ACTIONS.LOGOUT }))
          Auth.signOut()
        }}>
          Sign Out
        </Button>
      </Toolbar>
    </AppBar >
  )
}
