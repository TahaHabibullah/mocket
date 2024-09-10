import React from "react";
import Home from "./Home";
import Login from "./Login";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SymbolDashboard from "./SymbolDashboard";
import Register from "./Register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login"/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        <Route path="/dashboard" element={<Home/>}/>
        <Route path="/stocks/:symbol" element={<SymbolDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
