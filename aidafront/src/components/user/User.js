import React, { useState } from 'react'
import RegisterUpdate from '../shared/RegisterUpdate'
import { put } from '../../utils/httpHelper'

function User() {
  const [createUserFields, setCreateUserFields] = useState([
    {
      id: '0',
      placeholder: 'First Name *',
      type: 'textField',
      key: 'firstName'
    },
    {
      id: '1',
      placeholder: 'Last Name *',
      type: 'textField',
      key: 'lastName'
    },
    {
      id: '2',
      placeholder: 'Email *',
      type: 'textField',
      key: 'email'
    },
    {
      id: '3',
      placeholder: 'Phone *',
      type: 'textField',
      key: 'phone'
    }
  ])
  const [updateUserFields, setUpdateUserFields] = useState([
    {
      id: '0',
      placeholder: 'User Id *',
      type: 'textField',
      key: 'userId'
    },
    {
      id: '1',
      placeholder: 'First Name *',
      type: 'textField',
      key: 'firstName'
    },
    {
      id: '2',
      placeholder: 'Last Name *',
      type: 'textField',
      key: 'lastName'
    },
    {
      id: '3',
      placeholder: 'Email *',
      type: 'textField',
      key: 'email'
    },
    {
      id: '4',
      placeholder: 'Phone * (with country code eg. +91XXXXXXXXXX)',
      type: 'textField',
      key: 'phone'
    }
  ])
  const onSave = async (postBody) => {
    let response = await put("/users", postBody)
    if (response && response.userId && response.firstName && response.lastName)
      return { userId: response.userId, name: response.firstName + " " + response.lastName }
    else
      throw new Error(`Failed to ${postBody.body.action}`)
  }
  return (
    <RegisterUpdate
      createHeaderText={'Register New User'}
      updateHeaderText={'Update User'}
      createFields={createUserFields}
      updateFields={updateUserFields}
      onSave={onSave}
    />
  )
}

export default User