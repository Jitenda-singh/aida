import React, { useState } from 'react'
import { put } from '../../utils/httpHelper'
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
  const onSave = async (postBody) => {
    let response = await put("/camera-visibility", postBody)
    if (response && response.userId && response.cameraId)
      return { userId: response.userId, cameraId: response.cameraId }
    else
      throw new Error(`Failed to ${postBody.body.action}`)
  }
  return (
    <RegisterUpdate
      createHeaderText={'Register camera visible for user'}
      createFields={cameraVisibilityFields}
      hideUpdate={true}
      onSave={onSave}
    />
  )

}

export default CameraVisibility