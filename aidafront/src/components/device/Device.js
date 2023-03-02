import React, { useState } from 'react'
import { put } from '../../utils/httpHelper'
import RegisterUpdate from '../shared/RegisterUpdate'

function Device() {
  const [createDeviceFields, setCreateDeviceFields] = useState([
    {
      id: '0',
      placeholder: 'Device Name*',
      type: 'textField',
      key: 'deviceName'
    }
  ])
  const [updateDeviceFields, setUpdateDeviceFields] = useState([
    {
      id: '0',
      placeholder: 'Device Id*',
      type: 'textField',
      key: 'deviceId'
    },
    {
      id: '1',
      placeholder: 'Device Name*',
      type: 'textField',
      key: 'deviceName'
    },
  ])
  const onSave = async (postBody) => {
    let response = await put("/device", postBody)
    if (response && response.deviceId && response.deviceName)
      return { deviceId: response.deviceId, deviceName: response.deviceName }
    else
      throw new Error(`Failed to ${postBody.body.action}`)
  }
  return (
    <RegisterUpdate
      createHeaderText={'Register New Device'}
      updateHeaderText={'Update Device'}
      createFields={createDeviceFields}
      updateFields={updateDeviceFields}
      onSave={onSave}
    />
  )

}

export default Device