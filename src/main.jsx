import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app.jsx';
import './styles/main.css';
import { AuthProvider } from './context/authContext.jsx';
import { BrowserRouter } from 'react-router-dom';  // Importa BrowserRouter

ReactDOM.createRoot(document.getElementById('app')).render(
  <React.StrictMode>
    <BrowserRouter basename='/frontend-InventarioWeb/'>  {/* Envuelve tu app en BrowserRouter */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
