import React, { useState, useCallback, useEffect, useRef } from 'react'
import urlConstants from '../constants/urlConstants';
import { get } from '../utils/httpHelper'
import { getToken } from '../utils/authHelper'

function Welcome(props) {
  const [userInfo, setUserInfo] = useState()
  const loadedRef = useRef(false)
  const getData = useCallback(async () => {
    const searchParams = window.location && window.location.search ? window.location.search.replace("?", "") : ""
    const code = searchParams.split("=")[1];
    if (window.location.search) {
      const token = await getToken(code)
      const { data } = await get(urlConstants.getUser, undefined, undefined, {
        headers: { Authorization: `Bearer ${token.id_token}` }
      })
      setUserInfo(data)
    }
  }, [])

  useEffect(() => {
    if (!loadedRef.current) {
      loadedRef.current = true
      getData()
    }
  })
  return (
    userInfo
      ? <div>
        <div>Hi</div>
        {userInfo['cognito:username'] && <div>User Name:{userInfo['cognito:username']}</div>}
        {userInfo['email'] && <div>Email:{userInfo['email']}</div>}
        {userInfo['cognito:groups'] && <div>Groups:{userInfo['cognito:groups']}</div>}
      </div>
      : <div>Loading...</div>
  )
}

export default Welcome