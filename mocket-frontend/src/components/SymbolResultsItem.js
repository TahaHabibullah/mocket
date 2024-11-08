import React from "react";
import "../styling/SymbolResultsItem.css";
import { truncateOutput } from "./Utils";
import { useNavigate } from "react-router-dom";

const SymbolResultsItem = ( {name, symbol} ) => {
    const navigator = useNavigate();

    const handleRedirect = () => {
        const state = { name: name, symbol: symbol };
        navigator("/stocks/" + symbol, {state, replace: true});
    };

    return (
        <div className="result-item" onClick={handleRedirect}>
            <div className="result-item-name">{truncateOutput(name)}</div>
            <div className="result-item-sym">{symbol}</div>
        </div>
    );
};

export default SymbolResultsItem;