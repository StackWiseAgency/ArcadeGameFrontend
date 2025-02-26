import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/reset.css';

import GlobalFocusHandler from "./pages/GlobalFocusHandler"; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <GlobalFocusHandler>
    <App />
    </GlobalFocusHandler>
  </React.StrictMode>
);

reportWebVitals();
