import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import reportWebVitals from './tests/reportWebVitals';
import { UserProvider } from './components/UserProvider';
import './styling/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <UserProvider>
      <App/>
    </UserProvider>
);

reportWebVitals();
