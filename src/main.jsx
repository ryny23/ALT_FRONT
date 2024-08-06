import React from 'react'
import ReactDOM from 'react-dom/client'
import AppNew from './AppNew.jsx'
import './index.css'
import { ThemeProvider } from '@material-tailwind/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
    <AppNew />
    </ThemeProvider>
  </React.StrictMode>,
)
