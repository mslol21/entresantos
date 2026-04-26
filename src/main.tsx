import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CartProvider } from './context/CartContext.tsx'
import { DataProvider } from './context/DataContext.tsx'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <DataProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </DataProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
