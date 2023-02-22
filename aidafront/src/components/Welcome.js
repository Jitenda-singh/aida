import React, { useState, useCallback, useEffect, useRef } from 'react'
import urlConstants from '../constants/urlConstants';
import { get } from '../utils/httpHelper'
import { getToken } from '../utils/authHelper'
import Button from './Button';

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
      ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "30px" }}>
        <div>Hi <span style={{ textTransform: "capitalize" }}>{`${userInfo['given_name']} ${userInfo['family_name']}`}</span></div>
        {userInfo['cognito:username'] && <div style={{ margin: "20px 0 4px 0" }}>Name:&nbsp;<span style={{ textTransform: "capitalize" }}>{`${userInfo['given_name']} ${userInfo['family_name']}`}</span></div>}
        {userInfo['email'] && <div style={{ margin: "4px 0" }}>Email:&nbsp;<span>{userInfo['email']}</span></div>}
        {userInfo['cognito:groups'] && <div style={{ margin: "4px 0" }}>Groups:&nbsp;<span>{userInfo['cognito:groups']}</span></div>}
        <div style={{ margin: "20px 0" }}>
          <a href={`https://${process.env.REACT_APP_COGNITO_DOMAIN}/logout?client_id=${process.env.REACT_APP_COGNITO_APP_CLIENT_ID}&logout_uri=${process.env.REACT_APP_API_REDIRECT_URL + urlConstants.signOut}`}>
            <Button text={"Sign out"} />
          </a>
        </div>
      </div>
      : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "20px" }}>Loading...</div>
  )
}

export default Welcome