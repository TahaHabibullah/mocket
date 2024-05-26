import React from "react";
import "./SymbolResultsItem.css";
import { truncateOutput } from "./Utils";
import { useNavigate } from "react-router-dom";

const SymbolResultsItem = ( {name, symbol} ) => {
    const navigator = useNavigate();

    return <div className="result-item" onClick={() => navigator("stocks/" + symbol)}>
        <div className="result-item-name">{truncateOutput(name)}</div>
        <div className="result-item-sym">{symbol}</div>
    </div>
}

export default SymbolResultsItem;