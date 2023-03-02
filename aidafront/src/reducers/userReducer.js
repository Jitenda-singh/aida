import { createSlice } from '@reduxjs/toolkit'
import constants from '../constants/constants'
const initialState = {}

// Redux Toolkit slice
export const userReducer = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUser: (state, action) => {
      if (action && action.payload && action.payload.action === constants.ACTIONS.LOGOUT){
        return { ...action.payload }
      }
      return {
        ...state,
        ...action.payload
      }
    }
  }
})
export const { setUser } = userReducer.actions
// more code...
export default userReducer
