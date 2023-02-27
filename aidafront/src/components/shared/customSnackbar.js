/**
 *
 * AppSnackbar
 *
 */

import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import constants from '../../constants/constants'

const Alert = React.forwardRef(function Alert (props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function CustomizedSnackbar (props) {
  const anchorOrigin = props.anchorOrigin || { vertical: 'bottom', horizontal: 'center' }
  return (
    <Snackbar anchorOrigin={anchorOrigin} open={props.open} autoHideDuration={6000 * (props.type && props.type === constants.SUCCESS_MESSAGE.TYPE ? 1 : 100)} onClose={props.onClose}>
      <Alert onClose={props.onClose} severity={props.type} sx={{ width: '100%' }}>
        {props.message}
      </Alert>
    </Snackbar>
  )
}

CustomizedSnackbar.propTypes = {
  anchorOrigin: PropTypes.any,
  open: PropTypes.any,
  onClose: PropTypes.any,
  type: PropTypes.any,
  message: PropTypes.any
}

export default memo(CustomizedSnackbar)
