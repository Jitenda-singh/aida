import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import { makeStyles } from '@mui/styles'
import CloseTwoToneIcon from '@mui/icons-material/CloseTwoTone'

const useStyles = makeStyles((theme) => ({
  closeButton: {
    minWidth: 'auto !important',
    padding: '0px',
    '& .MuiSvgIcon-root': {
      color: theme.palette.black.black4f4f4f
    }
  },
  whiteButton: {
    color: `${theme.palette.white.whiteffffff} !important`
  }
}))

function CustomCloseIconButton (props) {
  const classes = useStyles(props)
  return (
    <Button onClick={props.onClick} disabled={props.disabled} className={`${classes.closeButton} ${classes[props.customColor + 'Button']} font-family-20`}><CloseTwoToneIcon /></Button>
  )
}

CustomCloseIconButton.propTypes = {
  onClick: PropTypes.any,
  disabled: PropTypes.any,
  customColor: PropTypes.any
}

export default memo(CustomCloseIconButton)
