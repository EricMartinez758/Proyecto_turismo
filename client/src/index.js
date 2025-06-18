import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'; 
import App from './App';
import store from './store'; 
import { AuthProvider } from '../../src/contexts/authcontexts.js'; 

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider> {}
        <App />
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
);