import React from "react";
import "../styling/PositionsTile.css";
import { useNavigate } from "react-router-dom";
import { parsePrice } from "./Utils";

const PositionsTile = ({ data, quoteData }) => {
    const navigator = useNavigate();

    const getDataStyle = () => {
        return parseFloat(quoteData.close) > parseFloat(quoteData.previous_close) ? 
        "positions-tile-data green" : "positions-tile-data red";
    }
    
    return (
        <div className="positions-tile" onClick={() => navigator("/stocks/" + data.symbol, {replace: true})}>
            <div className="positions-tile-symbol">{data.symbol}</div>
            <div className="positions-tile-divider"/>
            <div className="positions-tile-shares">{data.quantity} Shares</div>
            <div className={getDataStyle()}>${parsePrice(quoteData.close)}</div>
        </div>
    )
}

export default PositionsTile;