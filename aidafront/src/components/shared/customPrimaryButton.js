import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles((theme) => ({
  whiteButton: {
    color: `${theme.palette.white.whiteffffff} !important`
  }
}))

function CustomPrimaryButton (props) {
  const classes = useStyles(props)
  return (
    <Button onClick={props.onClick} disabled={props.disabled} className={`${classes[props.customColor + 'Button']} font-family-20`}>{props.buttonText}</Button>
  )
}

CustomPrimaryButton.propTypes = {
  buttonText: PropTypes.any,
  onClick: PropTypes.any,
  disabled: PropTypes.any,
  customColor: PropTypes.any
}

export default memo(CustomPrimaryButton)
