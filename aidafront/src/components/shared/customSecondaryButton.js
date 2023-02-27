import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  button: {
    color: `${theme.palette.black.black333333} !important`
  },
  whiteButton: {
    color: `${theme.palette.white.whiteffffff} !important`
  }
}))

function CustomSecondaryButton (props) {
  const classes = useStyles(props)
  return (
    <Button onClick={props.onClick} disabled={props.disabled} className={`${classes.button} ${classes[props.customColor + 'Button']} font-family-20`}>{props.buttonText}</Button>
  )
}

CustomSecondaryButton.propTypes = {
  buttonText: PropTypes.any,
  onClick: PropTypes.any,
  disabled: PropTypes.any,
  customColor: PropTypes.any
}

export default memo(CustomSecondaryButton)
