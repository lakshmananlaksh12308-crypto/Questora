import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Catch and silence transient 'WebSocket closed without opened' errors during server restarts/HMR
if (typeof window !== 'undefined') {
  const isIgnorableWsError = (reasonOrMsg: any) => {
    const text =
      typeof reasonOrMsg === 'string'
        ? reasonOrMsg
        : reasonOrMsg?.message || reasonOrMsg?.toString?.() || '';
    return (
      text.includes('WebSocket closed without opened') ||
      text.includes('WebSocket is closed before the connection is established') ||
      text.includes('failed: WebSocket is closed') ||
      text.includes('WebSocket connection to')
    );
  };

  window.addEventListener('unhandledrejection', (event) => {
    if (isIgnorableWsError(event.reason)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });

  window.addEventListener('error', (event) => {
    if (isIgnorableWsError(event.message || event.error)) {
      event.preventDefault();
      event.stopPropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(<App />);
