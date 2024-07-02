import React, { useState } from "react";
import SymbolSearch from "./SymbolSearch";
import SymbolResultsList from "./SymbolResultsList";
import "../styling/MocketNavBar.css";

const MocketNavBar = () => {
    const [results, setResults] = useState(null);
    return (
        <ul className="nav-bar">
            <li><a className="nav-bar-brand" href="">Mocket</a></li>
            <li className="nav-bar-search">
                <SymbolSearch setResults={setResults}/>
                {results && results.hasOwnProperty("data") && <SymbolResultsList results={results}/>}
            </li>
            <li><a className="nav-bar-repo" href="">Repository</a></li>
        </ul>
    );
}

export default MocketNavBar;