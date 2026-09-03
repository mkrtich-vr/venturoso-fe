import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { AppProvider } from './app-provider'
import { router } from './router'
import './styles/global.css'

const container = document.getElementById('root')
if (!container) throw new Error('Root element #root not found in index.html')

createRoot(container).render(
  <StrictMode>
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  </StrictMode>,
)
