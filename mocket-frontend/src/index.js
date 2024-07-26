import React from 'react';
import ReactDOM from 'react-dom/client';
import './styling/index.css';
import App from './components/App';
import reportWebVitals from './tests/reportWebVitals';
import { UserProvider } from './components/UserProvider';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
      <App/>
    </UserProvider>
);

reportWebVitals();
