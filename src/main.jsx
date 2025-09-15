import React from 'react';
import ReactDOM from 'react-dom/client';  // Updated import

import './index.css';
import { Provider } from 'react-redux';
import App from './App';
import { ContextProvider } from './contexts/ContextProvider';
import { store } from './redux/store';

// Create the root using createRoot
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <ContextProvider>
        <App />
      </ContextProvider>
    </Provider>
  </React.StrictMode>
);
