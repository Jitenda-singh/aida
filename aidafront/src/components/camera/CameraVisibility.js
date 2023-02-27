import React, { useState } from 'react'
import RegisterUpdate from '../shared/RegisterUpdate'

function CameraVisibility() {
  const [cameraVisibilityFields, setCameraVisibilityFields] = useState([
    {
      id: '0',
      placeholder: 'User Id*',
      type: 'textField',
      key: 'userId'
    },
    {
      id: '1',
      placeholder: 'Camera Id*',
      type: 'textField',
      key: 'cameraId'
    },
  ])
  
  return (
    <RegisterUpdate
      createHeaderText={'Register camera visible for user'}
      createFields={cameraVisibilityFields}
      hideUpdate={true}
    />
  )

}

export default CameraVisibility