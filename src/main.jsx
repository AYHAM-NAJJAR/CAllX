
import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import App from './App'
import {  BrowserRouter as Router } from 'react-router-dom'
import './index.css'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import { CallProvider } from './context/Call/CallContext'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
        <CallProvider>
          <App/>
        </CallProvider>
      <ToastContainer theme="dark" />
    </Router>
  </StrictMode>,
)
