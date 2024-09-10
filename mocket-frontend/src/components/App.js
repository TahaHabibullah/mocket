import React from "react";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SymbolDashboard from "./SymbolDashboard";
import { UserProvider } from "./UserProvider";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<UserProvider><Home/></UserProvider>}/>
        <Route path="/stocks/:symbol" element={<UserProvider><SymbolDashboard/></UserProvider>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
