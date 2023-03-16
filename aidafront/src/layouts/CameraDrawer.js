import React from 'react'
import { makeStyles } from '@mui/styles'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import { get } from '../utils/httpHelper'
import constants from '../constants/constants'
const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start'
  },
  drawerListItem: {
    backgroundColor: "rgb(222, 222, 222)",
    height: '55px',
    fontSize: '20px',
    borderBottom: '1px solid #cccccc',
    color: '#0d52a1'
  },
  devDrawerListItem: {
    backgroundColor: 'white',
    height: '55px',
    fontSize: '20px',
    borderBottom: '1px solid #cccccc',
    color: '#0d52a1'
  },
  camDrawerListItem: {
    backgroundColor: 'white',
    height: '55px',
    fontSize: '20px',
    borderBottom: '1px solid #cccccc',
    color: '#0d52a1'
  },
  listItemButton: {
    height: '100%',
    paddingTop: '14px',
    paddingLeft: '24px'
  },
  devListItemButton: {
    height: '100%',
    paddingTop: '14px',
    paddingLeft: '36px !important'
  },
  camListItemButton: {
    height: '100%',
    paddingTop: '14px',
    paddingLeft: '48px !important'
  },
  selectTextStyle: {
    fontSize: "20px !important",
    float: 'left',
    paddingLeft: "12px"
  },
  textStyle: {
    fontSize: "14px !important",
    float: 'left',
    paddingLeft: "12px"
  }
})
function CameraDrawer(props) {
  const { userData } = props
  const classes = useStyles()
  const [waitingForAPI, setWaitingForAPI] = React.useState(false)
  const [companyList, setCompanyList] = React.useState({})
  const [deviceList, setDeviceList] = React.useState({})
  const [cameraList, setCameraList] = React.useState({})
  const prepareData = async () => {
    setWaitingForAPI(true)
    try {
      const item = "camera-visibility"
      const itemId = "list"
      const queryStringParameters = { userId: userData['cognito:username'], limit: constants.LIMIT_200 }
      let compObj = {};
      let devObj = {};
      let cameraObj = {};
      // let newDataList =[]
      do {
        const response = await get(`/get/${item}/${itemId}`, { queryStringParameters })
        if (response && response.Items) {
          response.Items.map(item => {
            compObj[`${item.companyId}`] = item.companyName
            devObj[`${item.companyId}`] = { ...(devObj[`${item.companyId}`] || {}), [item.deviceId]: item.deviceName }
            cameraObj[`${item.deviceId}`] = { ...(cameraObj[`${item.deviceId}`] || {}), [item.cameraId]: item.cameraName }
          })
        }
        if (response && response.LastEvaluatedKey) {
          queryStringParameters["exclusiveStartKey"] = encodeURIComponent(JSON.stringify(response.LastEvaluatedKey))
        }
        if (response && !response.LastEvaluatedKey) break;
      } while (true)
      setCompanyList(compObj)
      setDeviceList(devObj)
      setCameraList(cameraObj)
      setWaitingForAPI(false)
    } catch (err) {
      alert("Failed to get cameras")
      setWaitingForAPI(false)
    }
  }

  React.useEffect(() => {
    prepareData()
  }, [])
  return (
    <div className={classes.root}>
      <Typography
        className={classes.selectTextStyle}
      >
        Select Camera
      </Typography>
      {Object.keys(companyList) && Object.keys(companyList).length ? Object.keys(companyList).map((compId, index) =>
        <>
          <ListItem key={compId} className={classes.drawerListItem} >
            <ListItemButton className={classes.listItemButton}>
              <ListItemText primary={<span>{companyList[compId]}</span>} />
            </ListItemButton>
          </ListItem>
          <DeviceItemList deviceList={deviceList[compId]} cameraList={cameraList} />
        </>
      ) : <Typography className={classes.textStyle}>{waitingForAPI ? "Loading..." : "No Camera"}</Typography>
      }
    </div>

  )
}

const DeviceItemList = (props) => {
  const { deviceList, cameraList } = props
  const classes = useStyles()
  console.log("deviceList==>", deviceList)
  return (
    deviceList && Object.keys(deviceList).length ? Object.keys(deviceList).map((devId, index) =>
      <>
        <ListItem key={devId} className={classes.devDrawerListItem} >
          <ListItemButton className={classes.devListItemButton}>
            <ListItemText primary={<span className={'deviceMenu'}>{deviceList[devId]}</span>} />
          </ListItemButton>
        </ListItem>
        <CameraItemList cameraList={cameraList[devId]} />
      </>
    ) : <Typography className={classes.textStyle}>No Device</Typography>

  )
}
const CameraItemList = (props) => {
  const { cameraList } = props
  const classes = useStyles()
  return (
    cameraList && Object.keys(cameraList).length ? Object.keys(cameraList).map((camId, index) =>
      <>
        <ListItem key={camId} className={classes.camDrawerListItem} >
          <ListItemButton className={classes.camListItemButton}>
            <ListItemText primary={<span className={'cameraMenu'}>{cameraList[camId]}</span>} />
          </ListItemButton>
        </ListItem>
      </>
    ) : <Typography className={classes.textStyle}>No Camera</Typography>

  )
}

export default CameraDrawer