import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import FormControlLabel from '@mui/material/FormControlLabel'
import ErrorIcon from '@mui/icons-material/Error'

const useStyles = makeStyles((theme) => ({
  error: {
    width: '.5em !important',
    color: theme.palette.error.dark,
    marginRight: theme.spacing(0.5),
    marginLeft: theme.spacing(1)
  },
  errorMessage: {
    fontSize: '.8em',
    color: theme.palette.error.dark
  }
}))

export default function FormControlError (props) {
  const classes = useStyles()
  return (
    <FormControlLabel
      control={<ErrorIcon className={classes.error} />}
      label={
        <span className={`${classes.errorMessage} font-family-11`}>
          {props.message}
        </span>
      }/>
  )
}

FormControlError.propTypes = {
  message: PropTypes.string
}
