import React, { useState } from "react";
import SymbolSearch from "./SymbolSearch";
import SymbolResultsList from "./SymbolResultsList";
import logo from "../assets/mocket-b.PNG";
import github from "../assets/github-mark-white.png";
import "../styling/MocketNavBar.css";

const MocketNavBar = () => {
    const [results, setResults] = useState(null);
    return (
        <ul className="nav-bar">
            <a href="/"><img src={logo} className="nav-bar-brand"/></a>
            <li className="nav-bar-search">
                <SymbolSearch setResults={setResults}/>
                {results && results.hasOwnProperty("data") && <SymbolResultsList results={results}/>}
            </li>
            <a href="https://github.com/TahaHabibullah/" target="_blank">
                <img src={github} className="nav-bar-repo"/>
            </a>
        </ul>
    );
}

export default MocketNavBar;