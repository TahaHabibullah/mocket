import React from "react";
import Home from "./Home";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SymbolDashboard from "./SymbolDashboard";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/stocks/:symbol" element={<SymbolDashboard/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
