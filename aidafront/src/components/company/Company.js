import React, { useState } from 'react'
import { post } from '../../utils/httpHelper'
import RegisterUpdate from '../shared/RegisterUpdate'

function Company() {
  const [createCompanyFields, setCreateCompanyFields] = useState([
    {
      id: '0',
      placeholder: 'Company Name *',
      type: 'textField',
      key: 'companyName'
    },
    {
      id: '1',
      placeholder: 'Add one or more contact user id *',
      type: 'textField',
      key: 'mainContactUserIds'
    }
  ])
  const [updateCompanyFields, setUpdateCompanyFields] = useState([
    {
      id: '0',
      placeholder: 'Company Id *',
      type: 'textField',
      key: 'companyId'
    },
    {
      id: '1',
      placeholder: 'Company Name *',
      type: 'textField',
      key: 'companyName'
    },
    {
      id: '2',
      placeholder: 'Add one or more main contact user id *',
      type: 'textField',
      key: 'mainContactUserIds'
    }
  ])
  const onSave = async (postBody) => {
    let response = await post("/company", postBody)
    if (response && response.companyId && response.companyName)
      return { companyId: response.companyId, name: response.companyName }
    else
      throw new Error(`Failed to ${postBody.body.action}`)
  }
  return (
    <RegisterUpdate
      createHeaderText={'Register New Company'}
      updateHeaderText={'Update Company'}
      createFields={createCompanyFields}
      updateFields={updateCompanyFields}
      onSave={onSave}
      company={true}
    />
  )
}

export default Company