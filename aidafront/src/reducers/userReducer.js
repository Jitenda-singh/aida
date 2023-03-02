import { createSlice } from '@reduxjs/toolkit'
const initialState = {}

// Redux Toolkit slice
export const userReducer = createSlice({
  name: 'user',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setUser: (state, action) => {
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
