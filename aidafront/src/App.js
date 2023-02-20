import React, { memo } from 'react'
import './App.css'
import Welcome from './components/Welcome';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import Login from './components/Login';
import SignOut from './components/SignOut';
function App() {
  const history = createBrowserHistory();
  return (
    <>
      <Router history={history}>
        <Routes>
          <Route path="/index.html" component={<Login />} />
          <Route path="/" element={<Login />} />
          <Route exact path="/welcome" element={<Welcome />} />
          <Route exact path="/sign-out" element={<SignOut />} />
        </Routes>
      </Router>
    </>
  )
}
export default memo(App)