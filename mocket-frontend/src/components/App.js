import React from "react";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import SymbolDashboard from "./SymbolDashboard";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from "./UserProvider";
import { expiredToken } from "./Utils";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={expiredToken() ? <Navigate to="/login"/> : <Navigate to="/dashboard"/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/verify-email" element={<Login/>}/>
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword/>}/>
        <Route path="/dashboard" element={<UserProvider><Home/></UserProvider>}/>
        <Route path="/stocks/:symbol" element={<UserProvider><SymbolDashboard/></UserProvider>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
