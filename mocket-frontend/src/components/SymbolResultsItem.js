import React from "react";
import "../styling/SymbolResultsItem.css";
import { truncateOutput } from "./Utils";
import { useNavigate } from "react-router-dom";

const SymbolResultsItem = ( {name, symbol} ) => {
    const navigator = useNavigate();

    return (
        <div className="result-item" onClick={() => navigator("/stocks/" + symbol, {replace: true})}>
            <div className="result-item-name">{truncateOutput(name)}</div>
            <div className="result-item-sym">{symbol}</div>
        </div>
    )
}

export default SymbolResultsItem;