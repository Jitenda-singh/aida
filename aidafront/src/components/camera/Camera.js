import React, { useState } from 'react'
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
      placeholder: 'Company Id*',
      type: 'textField',
      key: 'companyId'
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
      placeholder: 'Company Id*',
      type: 'textField',
      key: 'companyId'
    },
    {
      id: '3',
      placeholder: 'Camera Name *',
      type: 'textField',
      key: 'cameraName'
    },
    {
      id: '4',
      placeholder: 'Stream Id*',
      type: 'textField',
      key: 'streamId'
    }
  ])
  return (
    <RegisterUpdate
      createHeaderText={'Register New Camera'}
      updateHeaderText={'Update Camera'}
      createFields={createCameraFields}
      updateFields={updateCameraFields}
    />
  )

}

export default Camera