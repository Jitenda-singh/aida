import React, { useState } from 'react'
import { post } from '../../utils/httpHelper'
import RegisterUpdate from '../shared/RegisterUpdate'

function Camera() {
  const [createCameraFields, setCreateCameraFields] = useState([
    {
      id: '0',
      placeholder: 'Device Id*',
      type: 'textField',
      key: 'deviceId'
    },
    {
      id: '1',
      placeholder: 'Camera Name *',
      type: 'textField',
      key: 'cameraName'
    },
    {
      id: '2',
      placeholder: 'Stream Id*',
      type: 'textField',
      key: 'streamId'
    },
  ])
  const [updateCameraFields, setUpdateCameraFields] = useState([
    {
      id: '0',
      placeholder: 'Camera Id*',
      type: 'textField',
      key: 'cameraId'
    },
    {
      id: '1',
      placeholder: 'Device Id*',
      type: 'textField',
      key: 'deviceId'
    },
    {
      id: '2',
      placeholder: 'Camera Name *',
      type: 'textField',
      key: 'cameraName'
    },
    {
      id: '3',
      placeholder: 'Stream Id*',
      type: 'textField',
      key: 'streamId'
    }
  ])
  const onSave = async (postBody) => {
    let response = await post("/camera", postBody)
    if (response && response.cameraId && response.cameraName)
      return { cameraId: response.cameraId, cameraName: response.cameraName }
    else
      throw new Error(`Failed to ${postBody.body.action}`)
  }
  return (
    <RegisterUpdate
      createHeaderText={'Register New Camera'}
      updateHeaderText={'Update Camera'}
      createFields={createCameraFields}
      updateFields={updateCameraFields}
      onSave={onSave}
    />
  )

}

export default Camera