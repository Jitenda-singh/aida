import React, { useState } from 'react'
import { post } from '../../utils/httpHelper'
import RegisterUpdate from '../shared/RegisterUpdate'

function Device() {
  const [createDeviceFields, setCreateDeviceFields] = useState([
    {
      id: '0',
      placeholder: 'Device Name*',
      type: 'textField',
      key: 'deviceName'
    },
    {
      id: '1',
      placeholder: 'Company Id*',
      type: 'textField',
      key: 'companyId'
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
    {
      id: '2',
      placeholder: 'Company Id*',
      type: 'textField',
      key: 'companyId'
    }
  ])
  const onSave = async (postBody) => {
    let response = await post("/device", postBody)
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