import { createSlice } from '@reduxjs/toolkit'
const initialState = {}

// Redux Toolkit slice
export const navBarReducer = createSlice({
  name: 'navBar',
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    setNavBar: (state) => {
      return {
        ...state,
        locationPathName: window.location && window.location.pathname
      }
    }
  }
})
export const { setNavBar } = navBarReducer.actions
// more code...
export default navBarReducer
