import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { initApi } from './lib/initApi.ts';
import { loadConfig } from './lib/config.ts';

async function startApp() {
  await loadConfig();
  await initApi(); // wait for config and axios to be ready

  createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId="102147016941-lcucaktk0sioga2o5irssqcuedih5l0p.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}

startApp();
