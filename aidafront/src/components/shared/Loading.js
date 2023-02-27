/**
 *
 * No Item
 *
 */

import React, { memo } from 'react'
import { makeStyles } from '@mui/styles'
import Container from '@mui/material/Container'

const useStyles = makeStyles((theme) => ({
  container: {
    textAlign: 'center',
    color: theme.palette.primary.text
  }
}))

function Loading () {
  const classes = useStyles()
  return (
     <Container className={classes.container}>
       <h4 className='font-family-bold-24'>
         Loading...
       </h4>
     </Container>
  )
}

Loading.propTypes = {}
export default memo(Loading)
