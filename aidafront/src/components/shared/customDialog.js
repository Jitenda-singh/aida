
import React, { memo, Suspense } from 'react'
import PropTypes from 'prop-types'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { makeStyles } from '@mui/styles'
import { UserListDisplay } from './UserListDisplay'
import Typography from '@mui/material/Typography'
const Loading = React.lazy(() => import('./Loading'))
const CustomTextField = React.lazy(() => import('./customTextField'))
const CustomSecondaryButton = React.lazy(() => import('./customSecondaryButton'))
const CustomPrimaryButton = React.lazy(() => import('./customPrimaryButton'))
const CustomCloseIconButton = React.lazy(() => import('./customCloseIconButton'))

const useStyles = makeStyles((theme) => ({
  dialog: {
    '& .MuiPaper-root': {
      minWidth: '440px',
      maxWidth: '600px'
    },
    '& .MuiFormControl-root': {
      width: '100%'
    },
    '& .MuiInputBase-root': {
      width: '100%',
      margin: 'auto',
      padding: '3px 15px',
      '& input': {
        '&:focus': {
          color: theme.palette.primary.main
        },
        '::placeholder': {
          color: theme.palette.black.black4f4f4f,
          opacity: 1
        }
      }
    },
    '& .MuiDialogContent-root': {
      padding: '20px'
    },
    '& .MuiDialogActions-root': {
      justifyContent: 'center'
    },
    '& .MuiDialogTitle-root': {
      display: 'flex',
      flexDirection: 'row',
      padding: '15px',
      background: theme.palette.secondary.main,
      color: theme.palette.black.black4f4f4f
    }
  },
  titleText: {
    display: 'flex',
    flex: 1,
    paddingLeft: '20px'
  },
  inputAlign: {
    paddingTop: '15px',
    paddingBottom: '15px'
  },
  message: {
    marginBottom: '0px',
    marginTop: '10px',
    marginLeft: '15px',
    color: theme.palette.black.black333333
  },
  helperText:{
    fontSize: "14px !important",
    marginTop: "-14px !important"
  }
}))

function CustomDialog(props) {
  const classes = useStyles(props)
  const { handleClose, isSure, title, isDisabledClose, fields, message, primaryButtonText, secondaryButtonText, onSubmit, waitingForAPI, onChange, open, mainContactUserIdsList } = props
  return (
    <Dialog open={open} onClose={handleClose} className={classes.dialog}>
      <Suspense fallback={<Loading />}>
        <DialogTitle className={`${isSure ? 'font-family-bold-20' : 'font-family-semi-bold-20'}`}>
          <span className={classes.titleText}>{title}</span>
          {!isDisabledClose && <CustomCloseIconButton onClick={handleClose} disabled={waitingForAPI} />}
        </DialogTitle>
        <DialogContent>
          {fields && fields.length > 0 && fields.map((item, index) => <div key={index} className={classes.inputAlign}>
            <CustomTextField {...item} value={item.key && props[item.key]} onChange={(event) => onChange(item.key, event.target.value)} onKeyPress={(event) => {
              if (item.key === "mainContactUserIds")
                props.onChange('addMainContactUserIds', event)
            }} />
            {
              item.key === "mainContactUserIds" && <Typography className={classes.helperText}>Note: Press Enter to add main contact users</Typography>
            }
            {
              item.key === "mainContactUserIds" && mainContactUserIdsList && mainContactUserIdsList.length > 0 && <UserListDisplay onChange={onChange} mainContactUserIdsList={mainContactUserIdsList} />
            }
          </div>
          )}
          {message && <h4 className={`${classes.message} font-family-semi-bold-20`}>
            <span dangerouslySetInnerHTML={{ __html: message }} />
          </h4>}
        </DialogContent>
        <DialogActions>
          <CustomPrimaryButton onClick={onSubmit} disabled={waitingForAPI} buttonText={primaryButtonText} />
          <CustomSecondaryButton onClick={handleClose} disabled={waitingForAPI} buttonText={secondaryButtonText} />
        </DialogActions>
      </Suspense>
    </Dialog>
  )
}

CustomDialog.propTypes = {
  open: PropTypes.any,
  handleClose: PropTypes.any,
  title: PropTypes.any,
  isSure: PropTypes.any,
  isDisabledClose: PropTypes.any,
  message: PropTypes.any,
  schools: PropTypes.any,
  roles: PropTypes.any,
  waitingForAPI: PropTypes.any,
  fields: PropTypes.any,
  primaryButtonText: PropTypes.any,
  onChange: PropTypes.any,
  secondaryButtonText: PropTypes.any,
  onSubmit: PropTypes.any
}

export default memo(CustomDialog)
