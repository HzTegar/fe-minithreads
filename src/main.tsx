import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Apply saved theme before first render to prevent flash
try {
  const stored = localStorage.getItem('app_theme');
  if (stored === 'light') document.documentElement.classList.remove('dark');
  else document.documentElement.classList.add('dark');
} catch {
  document.documentElement.classList.add('dark');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
