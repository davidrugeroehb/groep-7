import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AdminContextProvider from './Context/Admincontext.jsx'
import BedrijfContextProvider from './Context/Bedrijfcontext.jsx'
import AppContextProvider from './Context/AppContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AdminContextProvider>
  {/* <BedrijfContextProvider> */}
    <AppContextProvider>
      <App />
    </AppContextProvider>
  {/* </BedrijfContextProvider> */}
</AdminContextProvider>
    
  </BrowserRouter>,
)
