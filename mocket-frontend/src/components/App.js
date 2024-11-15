import React from "react";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import SymbolDashboard from "./SymbolDashboard";
import Footer from "./Footer";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from "./UserProvider";
import { expiredToken } from "./Utils";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={expiredToken() ? <Navigate to="/login"/> : <Navigate to="/dashboard"/>}/>
        <Route path="/login" element={<div><Login/><Footer/></div>}/>
        <Route path="/register" element={<div><Register/><Footer/></div>}/>
        <Route path="/verify-email" element={<div><Login/><Footer/></div>}/>
        <Route path="/forgot-password" element={<div><ForgotPassword/><Footer/></div>}/>
        <Route path="/reset-password" element={<div><ResetPassword/><Footer/></div>}/>
        <Route path="/dashboard" element={<UserProvider><Home/><Footer/></UserProvider>}/>
        <Route path="/stocks/:symbol" element={<UserProvider><SymbolDashboard/><Footer/></UserProvider>}/>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
