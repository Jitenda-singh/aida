import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import TextField from '@mui/material/TextField'
import FormControlError from './formControlError'

const useStyles = makeStyles((theme) => ({
  textField: {
    '& .MuiFormControl-root': {
      width: '100%',
      marginBottom: '20px'
    },
    '& .MuiInputBase-root': {
      width: '100%',
      margin: 'auto',
      padding: '3px 12px',
      '& input': {
        '&:after, &:hover:not($disabled):after': {
          color: theme.palette.primary.main
        },
        '&::placeholder': {
          opacity: 1
        }
      }
    }
  },
  whiteTextField: {
    '& .MuiInput-underline': {
      borderBottomColor: '#fff',
      color: '#fff',
      '&:after, &:before, &:hover:not($disabled):after, &:hover:not($disabled):before': {
        borderBottomColor: '#fff',
        color: '#fff'
      }
    },
    '& .MuiInputBase-root': {
      '& input': {
        borderBottomColor: '#fff',
        color: '#fff',
        '&:after, &:before, &:hover:not($disabled):after, &:hover:not($disabled):before': {
          borderBottomColor: '#fff',
          color: '#fff'
        },
        '&::placeholder': {
          opacity: 1
        }
      }
    }
  }
}))

function CustomTextField (props) {
  const classes = useStyles(props)
  return (
    <span className={`${classes.textField} ${classes[props.customColor + 'TextField']}`}>
      <TextField {...props} className='input-base-input-font-family-18' variant="standard" helperText={props.error ? (<FormControlError message={props.message} />) : ('')} />
    </span>
  )
}

CustomTextField.propTypes = {
  customColor: PropTypes.any,
  error: PropTypes.any,
  message: PropTypes.any
}

export default memo(CustomTextField)
