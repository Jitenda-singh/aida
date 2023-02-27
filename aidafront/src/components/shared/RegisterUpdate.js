import { Button } from '@mui/material'
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
  const { createHeaderText, updateHeaderText, createFields, updateFields, hideUpdate } = props
  const [state, setState] = useState({
    open: false,
    action: "",
  })
  const [waitingForAPI, setWaitingForAPI] = useState(false)
  const onChange = (key, value) => {
    let obj = {}
    if (key === constants.ACTIONS.create || key === constants.ACTIONS.update) {
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
    setState(prevState => ({
      ...prevState,
      action: "",
      open: false
    }))
  }

  const onClickAction = async (action) => {
    if (state.action === constants.ACTIONS.create) {
    } else if (state.action === constants.ACTIONS.update) {

    } else {

    }
  }
  return (
    <div>
      <Button variant="contained" className={classes.buttonStyle} onClick={() => onChange(constants.ACTIONS.create)}>Register</Button>
      {
        !hideUpdate && <Button variant="contained" className={classes.buttonStyle} onClick={() => onChange(constants.ACTIONS.update)}>Update</Button>
      }
      <CustomDialog
        {...state}
        handleClose={() => handleClose()}
        title={state.action === constants.ACTIONS.create ? createHeaderText
          : state.action === constants.ACTIONS.update ? updateHeaderText :
            ""}
        onSubmit={() => onClickAction(constants.ACTIONS[state.action])}
        fields={state.action === constants.ACTIONS.create ? createFields : state.action === constants.ACTIONS.update ? updateFields : ""}
        primaryButtonText='SAVE'
        onChange={onChange}
        waitingForAPI={waitingForAPI}
        secondaryButtonText='CANCEL'
        snackbarOpen={state.snackbarOpen}
        snackbarMessage={state.snackbarMessage}
        snackbarType={state.snackbarType}
        onCloseSnackbar={() => onChange('snackbarOpen', false)}
        open={state.open} />
    </div>
  )
}

export default RegisterUpdate