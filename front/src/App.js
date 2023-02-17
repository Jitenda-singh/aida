import React, { memo } from 'react'
import './App.css'
import Welcome from './components/Welcome';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { createBrowserHistory } from 'history';
import Login from './components/Login';
function App() {
  const history = createBrowserHistory();
  return (
    <>
      <Router history={history}>
        <Routes>
          <Route path="/index.html" component={<Login />} />
          <Route path="/" element={<Login />} />
          <Route exact path="/welcome" element={<Welcome />} />
        </Routes>
      </Router>
    </>
  )
}
export default memo(App)