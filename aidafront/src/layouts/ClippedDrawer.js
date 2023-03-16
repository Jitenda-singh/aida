import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { makeStyles } from '@mui/styles'
import { NavLink, useLocation } from 'react-router-dom'
import constants from '../constants/constants'
import { useSelector } from 'react-redux'
import Loading from '../components/shared/Loading'
const CameraDrawer = React.lazy(() => import('./CameraDrawer'))
const drawerWidth = 185
const useStyles = makeStyles({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    marginTop: '-2px',
    boxShadow: '2px 2px 2px #d7d7d7',
    height: 'calc(100vh - 2px)',
    '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
    '& .active': {
      backgroundColor: '#dedede',
      color: '#136cb3'
    },
    '& .MuiListItem-root': {
      padding: '0px'
    }
  },
  overflowAuto: {
    overflow: 'auto'
  },
  drawerListItem: {
    backgroundColor: 'white',
    // height: '55px',
    fontSize: '20px',
    borderBottom: '1px solid #cccccc',
    color: '#0d52a1'
  },
  activeRoute: {
    color: '#ffffff'
  },
  listItemButton: {
    height: '100%',
    paddingTop: '14px',
    paddingLeft: '24px'
  },
  navLink: {
    width: '100%',
    textDecoration: 'none',
    backgroundColor: 'white',
    color: '#0d52a1',
    '& .MuiListItemButton-root': {
      paddingLeft: '24px'
    }
  }
})

export default function ClippedDrawer() {
  const classes = useStyles()
  const { userData } = useSelector((state) => state.user)
  const userGroupInfo = userData && userData["cognito:groups"] && userData["cognito:groups"].length > 0 && userData["cognito:groups"]
  const isAdminUser = userGroupInfo && userGroupInfo.some(item => item.includes("admin-group"))
  const isNormalUser = !isAdminUser && userGroupInfo && userGroupInfo.some(item => item.includes("user-group"))

  const [isView2, setIsView2] = React.useState(false)
  let location = useLocation();
  React.useEffect(() => {
    setIsView2(location.pathname === "/view2")
  }, [location])
  return (
    <Drawer
      variant="permanent"
      className={classes.drawer}
    >
      <Toolbar />
      <Box className={classes.overflowAuto}>
        <React.Suspense fallback={<Loading />}>
          <List>
            {isView2 ? isNormalUser ? <CameraDrawer userData={userData} /> : <></>
              : (constants.LEFT_MENU).map((item, index) => (
                (item.id < 6 ? isAdminUser
                  : item.id === 6 ? (isAdminUser || isNormalUser)
                    : item.id > 6 ? isNormalUser
                      : false) &&
                <ListItem key={index} className={classes.drawerListItem} >
                  <NavLink isActive={(match) => {
                    if (!match) {
                      return false
                    }
                    const eventID = parseInt(match.params.eventID)
                    return !isNaN(eventID) && eventID % 2 === 1
                  }} to={item.path} className={classes.navLink}>
                    <ListItemButton className={classes.listItemButton}>
                      <ListItemText primary={<span className='font-family-20'>{item.title}</span>} />
                    </ListItemButton>
                  </NavLink>
                </ListItem>
              ))}
          </List>
        </React.Suspense>
      </Box>
    </Drawer>
  )
}
