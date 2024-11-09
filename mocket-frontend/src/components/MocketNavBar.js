import React, { useState } from "react";
import SymbolSearch from "./SymbolSearch";
import SymbolResultsList from "./SymbolResultsList";
import logo from "../assets/mocket-b.png";
import iconLogo from "../assets/mocket-logo.png";
import github from "../assets/github-mark-white.png";
import "../styling/MocketNavBar.css";
import { useNavigate } from "react-router-dom";
import { useMediaQuery } from 'react-responsive';

const MocketNavBar = ({ style }) => {
    const navigator = useNavigate();
    const [results, setResults] = useState(null);
    const isMobile = useMediaQuery({ maxWidth: 767 });

    const handleLogout = () => {
        localStorage.clear();
        navigator("/login");
    };

    const handleLoginRedirect = () => {
        navigator("/login");
    };

    const handleRegisterRedirect = () => {
        navigator("/register");
    };

    const handleDashboardRedirect = () => {
        navigator("/dashboard");
    };

    const handleRootRedirect = () => {
        navigator("/");
    };

    return (
        style === "dashboard" ? (
            <div className="nav-bar">
                <div className="nav-bar-left">
                    <a href="#" onClick={handleDashboardRedirect}><img src={isMobile ? iconLogo : logo} alt="" className={isMobile ? "nav-bar-brand-icon" : "nav-bar-brand-logo"}/></a>
                    <div className="nav-bar-search">
                        <SymbolSearch setResults={setResults}/>
                        {results && results.hasOwnProperty("data") && <SymbolResultsList results={results}/>}
                    </div>
                </div>
                <div className="nav-bar-right">
                    <button className="nav-bar-logout" onClick={handleLogout}>Log Out</button>
                    <a href="https://github.com/TahaHabibullah/mocket" target="_blank" rel="noreferrer">
                        <img src={github} alt="" className="nav-bar-repo"/>
                    </a>
                </div>
            </div>
        ) : (
            <div className="nav-bar">
                <a href="#" onClick={handleRootRedirect}><img src={isMobile ? iconLogo : logo} alt="" className={isMobile ? "nav-bar-brand-icon" : "nav-bar-brand-logo"}/></a>
                <div className="nav-bar-right">
                    <button className="nav-bar-login" onClick={handleLoginRedirect}>Log In</button>
                    <button className="nav-bar-register" onClick={handleRegisterRedirect}>Register</button>
                    <a href="https://github.com/TahaHabibullah/mocket" target="_blank" rel="noreferrer">
                        <img src={github} alt="" className="nav-bar-repo"/>
                    </a>
                </div>
            </div>
        )
    );
};

export default MocketNavBar;