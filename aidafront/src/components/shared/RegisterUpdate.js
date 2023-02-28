import { Button, Typography } from '@mui/material'
import React, { useState } from 'react'
import { makeStyles } from '@mui/styles'
import CustomDialog from '../shared/customDialog'
import constants from '../../constants/constants'

const useStyles = makeStyles((theme) => ({
  buttonStyle: {
    margin: "4px !important"
  }
}))
function RegisterUpdate(props) {
  const classes = useStyles()
  const { createHeaderText, updateHeaderText, createFields, updateFields, hideUpdate, onSave } = props
  const [state, setState] = useState({
    open: false,
    action: "",
  })
  const [waitingForAPI, setWaitingForAPI] = useState(false)
  const onChange = (key, value, ind) => {
    console.log("onChange==>", key, value, ind)
    let obj = {}
    if (key === "addMainContactUserIds") {
      if (value.key === 'Enter') {
        obj["mainContactUserIdsList"] = [...state.mainContactUserIdsList || [], value.target.value]
        obj["mainContactUserIds"] = ""
      }
    } else if (key === "deleteMainContactUserIds") {
      let mainContactUserIdsListCopy = state.mainContactUserIdsList || []
      mainContactUserIdsListCopy.splice(ind, 1)
      obj["mainContactUserIdsList"] = [...mainContactUserIdsListCopy]
    } else if (key === constants.ACTIONS.create || key === constants.ACTIONS.update) {
      obj = {
        action: key,
        open: true
      }
    } else {
      obj = {
        [key]: value
      }
    }
    setState(prevState => ({
      ...prevState,
      ...obj
    }))
  }
  const handleClose = () => {
    setState({
      open: false,
      action: ""
    })
  }

  const onClickAction = async () => {
    let postBody = {}
    try {
      postBody.body = {
        action: state.action
      };
      const fieldsCopy = state.action === constants.ACTIONS.create ? createFields
        : state.action === constants.ACTIONS.update ? updateFields : []
      fieldsCopy.map((field) => {
        if (field.key === "mainContactUserIds" && state.mainContactUserIdsList && state.mainContactUserIdsList.length > 0) {
          postBody.body[field.key] = state.mainContactUserIdsList
        } else if (field.key !== "mainContactUserIds" && (state[field.key] !== undefined || state[field.key].trim() !== "")) {
          postBody.body[field.key] = state[field.key].trim()
        } else {
          throw new Error('Please fill all fields')
        }
      })
      const response = await onSave(postBody)
      let textMessage = ""
      Object.keys(response) && Object.keys(response).length > 0 && Object.keys(response).map(key => {
        textMessage += `${key}: ${response[key]} `
      })
      if (response)
        setState({
          open: false,
          action: "",
          textToDisplay: `${textMessage}has been ${state.action}d successfully!`
        })
    } catch (err) {
      console.log("Error", err)
      setState({
        ...state,
        textToDisplay: `Failed to ${state.action}`
      })
    }
  }
  return (
    <div>
      <Button variant="contained" className={classes.buttonStyle} onClick={() => onChange(constants.ACTIONS.create)}>Register</Button>
      {
        !hideUpdate && <Button variant="contained" className={classes.buttonStyle} onClick={() => onChange(constants.ACTIONS.update)}>Update</Button>
      }
      {state.textToDisplay && <Typography style={{ marginTop: "20px" }}>{state.textToDisplay}</Typography>}
      <CustomDialog
        {...state}
        handleClose={() => handleClose()}
        title={state.action === constants.ACTIONS.create ? createHeaderText
          : state.action === constants.ACTIONS.update ? updateHeaderText :
            ""}
        onSubmit={onClickAction}
        fields={state.action === constants.ACTIONS.create ? createFields : state.action === constants.ACTIONS.update ? updateFields : ""}
        primaryButtonText='SAVE'
        onChange={onChange}
        waitingForAPI={waitingForAPI}
        secondaryButtonText='CANCEL'
        mainContactUserIdsList={state.mainContactUserIdsList}
        open={state.open} />
    </div>
  )
}

export default RegisterUpdate