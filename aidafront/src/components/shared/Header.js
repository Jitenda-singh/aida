import React, { memo } from 'react'
// import LogoImg from '../../assets/img/logo.png'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '60px',
    marginBottom: '44px'
  },
  logo: {
    maxHeight: '154px'
  }
})
function Header () {
  const classes = useStyles()
  return (
    <div className={classes.header}>
      {/* <img alt='logo' src={LogoImg} className={classes.logo} loading='lazy' /> */}
      {/* AIDA */}
    </div>
  )
}
export default memo(Header)
