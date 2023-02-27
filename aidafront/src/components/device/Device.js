import React, { useState } from 'react'
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
  return (
    <RegisterUpdate
      createHeaderText={'Register New Device'}
      updateHeaderText={'Update Device'}
      createFields={createDeviceFields}
      updateFields={updateDeviceFields}
    />
  )

}

export default Device