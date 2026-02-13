import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppContainer from './AppContainer.jsx';

import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContainer />
  </StrictMode>
)