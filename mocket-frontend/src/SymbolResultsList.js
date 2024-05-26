import React from "react";
import "./SymbolResultsList.css"
import SymbolResultsItem from "./SymbolResultsItem";

const SymbolResultsList = ({ results }) => {
    return <div className="results-list">
        {
        results.data.map((data, index) => {
            if(!data.instrument_name)
                return null;
            return <SymbolResultsItem name={data.instrument_name} symbol={data.symbol} key={index}/>
        })}
    </div>
}

export default SymbolResultsList;