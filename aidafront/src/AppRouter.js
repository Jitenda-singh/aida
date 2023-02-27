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

function AppRouter() {
  const { isAuthenticated } = useSelector((state) => state.user)
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Routes>
          {
            <Route path='/' element={<Layout />}>
              <Route path="/" element={<Navigate replace to={`${isAuthenticated ? '/welcome' : '/sign-out'}`} />} />
              <Route path='/welcome' element={<PrivateAppRouter isAuthenticated={isAuthenticated} element={Welcome} />} />
              <Route path='/user' element={<PrivateAppRouter isAuthenticated={isAuthenticated} element={User} />} />
              <Route path='/company' element={<PrivateAppRouter isAuthenticated={isAuthenticated} element={Company} />} />
              <Route path='/camera' element={<PrivateAppRouter isAuthenticated={isAuthenticated} element={Camera} />} />
              <Route path='/device' element={<PrivateAppRouter isAuthenticated={isAuthenticated} element={Device} />} />
              <Route path='/camera-visibility' element={<PrivateAppRouter isAuthenticated={isAuthenticated} element={CameraVisibility} />} />
              <Route exact path="/sign-out" element={<PublicAppRouter isAuthenticated={isAuthenticated} element={SignOut} />} />
              <Route exact path="/sign-in" element={<PublicAppRouter isAuthenticated={isAuthenticated} element={SignIn} />} />
            </Route>
          }
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