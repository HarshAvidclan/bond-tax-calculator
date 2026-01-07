import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import BondCalculatorPage from './Components/BondCalculatorPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <App /> */}
    <BondCalculatorPage />
  </StrictMode>,
)
