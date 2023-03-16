import React, { memo, Suspense } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import Loading from './components/shared/Loading'
import { useSelector } from 'react-redux'
const Layout = React.lazy(() => import('./layouts/Layout'))
const SignIn = React.lazy(() => import('./components/SignIn'))
const SignOut = React.lazy(() => import('./components/SignOut'))
const Welcome = React.lazy(() => import('./components/Welcome'))
const User = React.lazy(() => import('./components/user/User'))
const Company = React.lazy(() => import('./components/company/Company'))
const Device = React.lazy(() => import('./components/device/Device'))
const Camera = React.lazy(() => import('./components/camera/Camera'))
const CameraVisibility = React.lazy(() => import('./components/camera/CameraVisibility'))
const View1 = React.lazy(() => import('./components/view/View1'))
const View2 = React.lazy(() => import('./components/view/View2'))

function AppRouter() {
  const { isAuthenticated, userData } = useSelector((state) => state.user)
  const userGroupInfo = userData && userData["cognito:groups"] && userData["cognito:groups"].length > 0 && userData["cognito:groups"]
  const isAdminUser = userGroupInfo && userGroupInfo.some(item => item.includes("admin-group"))
  const isNormalUser = !isAdminUser && userGroupInfo && userGroupInfo.some(item => item.includes("user-group"))

  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route path="/" element={<Navigate replace to={`${isAuthenticated ? '/welcome' : '/sign-out'}`} />} />
            <Route path="/sign-out" element={<PublicAppRouter isAuthenticated={isAuthenticated} element={SignOut} />} />
            <Route path="/sign-in" element={<PublicAppRouter isAuthenticated={isAuthenticated} element={SignIn} />} />
            <Route path='/welcome' element={<PrivateAppRouter isAuthenticated={isAuthenticated} element={Welcome} />} />
            <Route path='/user' element={<PrivateAppRouter isAuthenticated={isAuthenticated && isAdminUser} element={User} />} />
            <Route path='/company' element={<PrivateAppRouter isAuthenticated={isAuthenticated && isAdminUser} element={Company} />} />
            <Route path='/camera' element={<PrivateAppRouter isAuthenticated={isAuthenticated && isAdminUser} element={Camera} />} />
            <Route path='/device' element={<PrivateAppRouter isAuthenticated={isAuthenticated && isAdminUser} element={Device} />} />
            <Route path='/camera-visibility' element={<PrivateAppRouter isAuthenticated={isAuthenticated && isAdminUser} element={CameraVisibility} />} />
            <Route path='/view1' element={<PrivateAppRouter isAuthenticated={isAuthenticated} element={View1} />} />
            <Route path='/view2' element={<PrivateAppRouter isAuthenticated={isAuthenticated && isNormalUser} element={View2} />} />
          </Route>
        </Routes>
      </Router>
    </Suspense>
  )
}

function PublicAppRouter(props) {
  const Element = props.element
  return (
    props.isAuthenticated ? <Navigate replace to='/welcome' /> : <Element />
  )
}

PublicAppRouter.propTypes = {
  isAuthenticated: PropTypes.any,
  element: PropTypes.any
}

function PrivateAppRouter(props) {
  const Element = props.element
  return (
    props.isAuthenticated ? <Element /> : <Navigate replace to='/sign-out' />
  )
}

PrivateAppRouter.propTypes = {
  isAuthenticated: PropTypes.any,
  element: PropTypes.any
}

export default memo(AppRouter)