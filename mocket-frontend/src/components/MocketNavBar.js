import React, { useState } from "react";
import SymbolSearch from "./SymbolSearch";
import SymbolResultsList from "./SymbolResultsList";
import logo from "../assets/mocket-b.png";
import github from "../assets/github-mark-white.png";
import "../styling/MocketNavBar.css";
import { useNavigate } from "react-router-dom";

const MocketNavBar = ({ style }) => {
    const navigator = useNavigate();
    const [results, setResults] = useState(null);

    const handleLogout = () => {
        localStorage.clear();
        navigator("/login");
        window.location.reload();
    }

    const handleLoginRedirect = () => {
        navigator("/login");
        window.location.reload();
    }

    const handleRegisterRedirect = () => {
        navigator("/register");
        window.location.reload();
    }

    return (
        style === "dashboard" ? (
            <div className="nav-bar">
                <div className="nav-bar-left">
                    <a href="/dashboard"><img src={logo} alt="" className="nav-bar-brand"/></a>
                    <div className="nav-bar-search">
                        <SymbolSearch setResults={setResults}/>
                        {results && results.hasOwnProperty("data") && <SymbolResultsList results={results}/>}
                    </div>
                </div>
                <div className="nav-bar-right">
                    <button className="nav-bar-logout" onClick={handleLogout}>Log Out</button>
                    <a href="https://github.com/TahaHabibullah/" target="_blank" rel="noreferrer">
                        <img src={github} alt="" className="nav-bar-repo"/>
                    </a>
                </div>
            </div>
        ) : (
            <div className="nav-bar">
                <a href="/"><img src={logo} alt="" className="nav-bar-brand"/></a>
                <div className="nav-bar-right">
                    <button className="nav-bar-login" onClick={handleLoginRedirect}>Log In</button>
                    <button className="nav-bar-register" onClick={handleRegisterRedirect}>Register</button>
                    <a href="https://github.com/TahaHabibullah/" target="_blank" rel="noreferrer">
                        <img src={github} alt="" className="nav-bar-repo"/>
                    </a>
                </div>
                
            </div>
        )
    );
}

export default MocketNavBar;