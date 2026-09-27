import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Previne Unhandled Rejection e erros decorrentes de conexões de desenvolvimento (ex: WebSocket fechado pelo proxy)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const msg =
      typeof reason === 'string'
        ? reason
        : reason && typeof reason === 'object'
        ? reason.message || reason.stack || String(reason)
        : '';

    if (
      msg.includes('WebSocket') ||
      msg.includes('websocket') ||
      msg.includes('closed without opened') ||
      msg.includes('failed to connect to websocket')
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const msg = (event && (event.message || (event.error && event.error.message))) || '';
    if (
      typeof msg === 'string' &&
      (msg.includes('WebSocket') ||
       msg.includes('websocket') ||
       msg.includes('closed without opened') ||
       msg.includes('failed to connect to websocket'))
    ) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
