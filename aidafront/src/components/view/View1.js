import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/system/Box';
import { get } from '../../utils/httpHelper';
import { useSelector } from 'react-redux';
import Loading from '../shared/Loading';
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    width: '100vw-300px'
  },
  itemStyle: {
    // width: 400
    width: "100%",
    lineHeight: "20px",
    display: 'flex',
    justifyContent: 'space-between',
    "& .MuiButton-sizeSmall": {
      textTransform: "none !important",
      fontSize: "14px",
      color: theme.palette.primary.text
    }
  },
  marginTop20: {
    marginTop: 20
  },
  boxStyle: {
    display: 'flex',
    width: "100%",
    '& > :not(style)': {
      marginTop: 10,
      width: "100%",
      height: 300,
      borderRadius: 8
    },
  },
  buttonStyle: {
    "& .MuiButton-sizeSmall": {
      textTransform: "none !important",
      fontSize: "14px",
      fontFamily: "Figtree, sans-serif !important",
      color: theme.palette.primary.text
    }
  },
  inputStyle: {
    height: "24px",
    width: "30ch",
    fontSize: "14px",
    fontWeight: "400 !important",
    fontFamily: "Figtree, sans-serif !important",
  },
  tdStyle: {
    padding: "10px",
    whiteSpace: "nowrap",
    textAlign: "left"
  }
}))
function View1() {
  const { userData } = useSelector((state) => state.user)
  const [list, setList] = useState([
    {
      id: 0,
      text: "Fetch cameras visible for current user"
    },
    {
      id: 1,
      text: "Fetch current user info"
    },
    {
      id: 2,
      text: "Fetch camera info by camera id",
      textFieldReq: true,
      key: "cameraById",
      value: ""
    },
    {
      id: 3,
      text: "Fetch cameras visible for given user id",
      textFieldReq: true,
      key: "cameraVisibleByUserId",
      value: ""
    },
    {
      id: 4,
      text: "Fetch user info by given user id",
      textFieldReq: true,
      key: "userById",
      value: ""
    },
    {
      id: 5,
      text: "Fetch company by company id",
      textFieldReq: true,
      key: "companyById",
      value: ""
    },
    {
      id: 6,
      text: "Fetch devices"
    },
    {
      id: 7,
      text: "Fetch users who see certain cameras by camera id",
      textFieldReq: true,
      key: "usersByCameraId",
      value: ""
    },
    {
      id: 8,
      text: "Fetch cameras by device id",
      textFieldReq: true,
      key: "camerasByDeviceId",
      value: ""
    }
  ])
  const [results, setResults] = useState()
  const [loadMore, setLoadMore] = useState(false)
  const [currIndex, setCurrIndex] = useState()
  const [error, setError] = useState()
  const [waitingForAPI, setWaitingForAPI] = useState(false)
  const classes = useStyles()
  const onChange = (index, value) => {
    const obj = {
      value: value
    }
    let listCopy = [...list]
    listCopy[index] = {
      ...listCopy[index],
      ...obj
    }
    setList(listCopy)
  }
  const handleClick = async (index, next) => {
    try {
      if (index !== currIndex) setResults()
      setError()
      setWaitingForAPI(true)
      let item, itemId;
      let queryStringParameters = {}
      if (list[index].textFieldReq && list[index].value && list[index].value.trim() !== "") {
        item = index === 2 || index === 8 ? "camera"
          : index === 3 ? "camera-visibility"
            : index === 4 || index === 7 ? "user"
              : index === 5 ? "company"
                : ""
        itemId = (index !== 7 && index !== 3 && index !== 8) ? list[index].value.trim() : "list"
        queryStringParameters = index === 7 ? { cameraId: list[index].value.trim() }
          : index === 3 ? { userId: list[index].value.trim() }
            : index === 8 ? { deviceId: list[index].value.trim() }
              : ""
      } else {
        item = index === 0 ? "camera-visibility" : index === 1 ? "user" : index === 6 ? "device" : ""
        itemId = index === 1 ? userData['cognito:username'] : index === 0 || index === 6 ? "list" : ""
        queryStringParameters = index === 0 ? { userId: userData['cognito:username'] }
          : ""
      }
      if (next && results && results.LastEvaluatedKey) {
        queryStringParameters["exclusiveStartKey"] = encodeURIComponent(JSON.stringify(results.LastEvaluatedKey))
      }
      const response = await get(`/get/${item}/${itemId}`, { queryStringParameters })
      if (response.statusCode === '401') throw Error("Unauthorized User")
      setLoadMore(response && response.LastEvaluatedKey)
      setCurrIndex(index)
      setResults(
        next ? {
          Items: [...results.Items, ...response.Items],
          Count: results.Count + (response.Count || 0),
          ScannedCount: results.ScannedCount + (response.ScannedCount || 0),
          LastEvaluatedKey: response.LastEvaluatedKey || undefined
        }
          : response
      )
      setWaitingForAPI(false)
    } catch (err) {
      setResults()
      setCurrIndex(index)
      setError(err.message)
      setWaitingForAPI(false)
    }
  }
  return (
    <div className={classes.root}>{
      list.map((item, index) =>
        <div key={item.id} className={classes.itemStyle}>
          <div className='list-item'>
            <span>{index + 1}.&nbsp;</span>
            <Button size="small" className={`${classes.buttonStyle} list-item`} onClick={() => handleClick(index)}>{item.text}</Button>
          </div>
          {item.textFieldReq && <input type="text" id={item.id} onChange={event => onChange(index, event.target.value)} className={classes.inputStyle} />}
        </div>
      )
    }
      <div className={classes.marginTop20}>
        Results:
      </div>
      <Box
        className={classes.boxStyle}
      >
        <Paper variant="outlined" style={{ overflow: "auto" }}>
          <table>
            {
              results && results.Items ?
                results.Items.length > 0 ? results.Items.map(row =>
                  <tr>
                    {
                      row && Object.keys(row) && Object.keys(row).length && Object.keys(row).length > 0 ? Object.keys(row).sort().map(item =>
                        <td key={item} width="100%" className={`${classes.tdStyle} view1-results`}>
                          {item}:&nbsp;{typeof row[item] === "object" ? row[item].join(", ") : row[item]}
                        </td>)
                        : <></>
                    }
                  </tr>
                )
                  : <Typography style={{ padding: "10px" }} className='view1-results'>No Items</Typography>
                : <tr>
                  {
                    results && Object.keys(results) && Object.keys(results).length && Object.keys(results).length > 0 ? Object.keys(results).sort().map(item =>
                      <td key={item} width="100%" style={{ padding: "10px", whiteSpace: "nowrap" }} className='view1-results'>
                        {item}:&nbsp;{typeof results[item] === "object" ? results[item].join(", ") : results[item]}
                      </td>)
                      : <></>
                  }
                </tr>
            }
            {
              error && <Typography style={{ padding: "10px" }} className='view1-results'>{error}</Typography>
            }
          </table>
          <div className={classes.buttonStyle}>
            {
              loadMore ? <Button size="small" onClick={() => handleClick(currIndex, true)}>Load more</Button>
                : waitingForAPI ? <Loading /> : <></>
            }
          </div>
        </Paper>
      </Box>
    </div>
  )
}

export default View1