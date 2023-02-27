import React, { memo, Suspense, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@mui/styles'
import Autocomplete from '@mui/material/Autocomplete'
const CustomTextField = React.lazy(() => import('./customTextField'))
const Loading = React.lazy(() => import('./Loading'))

const useStyles = makeStyles((theme) => ({
  autocomplete: {
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
    }
  }
}))

function CustomAutocomplete (props) {
  const classes = useStyles()
  const { options, onChangeCallback } = props
  const [value, setValue] = useState(props.valueTitle)
  const [inputValue, setInputValue] = useState('')
  useEffect(() => {
    if (!props.valueTitle && props.valueTitle !== value) {
      setValue(props.valueTitle)
      setInputValue('')
    }
  }, [props.valueTitle])
  return (
    <span className={classes.autocomplete}>
      <Suspense fallback={<Loading />}>
        {options && <Autocomplete
          key={props.valueTitle}
          id={props.id}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue)
            onChangeCallback(newValue)
          }}
          clearOnBlur={true}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue)
          }}
          disabled={props.disabled}
          options={options}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => <CustomTextField {...props} {...params} placeholder={props.placeholder} />}
        />}
      </Suspense>
    </span>
  )
}

CustomAutocomplete.propTypes = {
  placeholder: PropTypes.any,
  options: PropTypes.any,
  id: PropTypes.any,
  disabled: PropTypes.any,
  valueTitle: PropTypes.any,
  onChangeCallback: PropTypes.any
}

export default memo(CustomAutocomplete)
