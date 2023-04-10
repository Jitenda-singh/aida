import React, { useCallback, useEffect, useState } from 'react'
import Typography from '@mui/material/Typography'
import KVSPlayer from './KVSPlayer'
import { useParams } from 'react-router-dom'
import { get } from '../../utils/httpHelper'
import Loading from '../shared/Loading'
import { makeStyles } from '@mui/styles'
const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: "-250px"
  },
  errorMessage:{
    margin: "20px 0 0 0 !important"
  }
}))
function View2() {
  const params = useParams()
  const classes = useStyles()
  const [cameraId, setCameraId] = useState();
  const [hlsURL, setHlsURL] = useState();
  const [waitingForAPI, setWaitingForAPI] = useState();
  const [message, setMessage] = useState('');
  const getHlsURL = useCallback(async () => {
    setWaitingForAPI(true);
    setCameraId(params.id)
    try {
      const response = await get(`/get/video-stream/${params.id}`)
      if (response.statusCode === '401') throw Error("Unauthorized User")
      setHlsURL(response.url)
      setWaitingForAPI(false);
      setMessage("");
    } catch (err) {
      setWaitingForAPI(false);
      setHlsURL()
      if (err.response.status === 404) {
        setMessage("Failed to get live stream url.")
      } else {
        // handle other errors
        setMessage(err.message);
      }
    }
  }, [params.id])
  useEffect(() => {
    if (params && params.id)
      getHlsURL();
  }, [params.id])
  return (
    <div className={classes.root}>
      <Typography className={`view2-title`}>Welcome, please select the camera on the left to see the live stream</Typography>
      {waitingForAPI ? <Loading /> :
        (hlsURL ? <KVSPlayer hlsURL={hlsURL} getHlsURL={getHlsURL} />
          : message ? <Typography className={`view2-title ${classes.errorMessage}`}>{message}</Typography>
            : <></>)
      }
    </div>

  )
}

export default View2