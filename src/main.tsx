import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './i18n/config';   // initialize i18next before anything else
import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
