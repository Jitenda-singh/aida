import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom";
import { Auth } from 'aws-amplify'
import constants from '../constants/constants';
import { API } from 'aws-amplify'
import { useSelector } from 'react-redux';


function Welcome(props) {
  const loadedRef = useRef(false)
  const navigate = useNavigate();
  // const classes = useStyles()
  const {userData} = useSelector((state) => state.user)
  const [userInfo, setUserInfo] = useState(userData)

  return (
    userInfo
      ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "30px" }}>
      <div>Hi <span style={{ textTransform: "capitalize" }}>{`${userInfo['given_name']} ${userInfo['family_name']}`}</span></div>
      {userInfo['cognito:username'] && <div style={{ margin: "20px 0 4px 0" }}>Name:&nbsp;<span style={{ textTransform: "capitalize" }}>{`${userInfo['given_name']} ${userInfo['family_name']}`}</span></div>}
      {userInfo['email'] && <div style={{ margin: "4px 0" }}>Email:&nbsp;<span>{userInfo['email']}</span></div>}
      {userInfo['cognito:groups'] && <div style={{ margin: "4px 0" }}>Groups:&nbsp;<span>{userInfo['cognito:groups'].join(', ')}</span></div>}
    </div>
      : <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", marginTop: "20px" }}>Loading...</div>
  )
}

export default Welcome