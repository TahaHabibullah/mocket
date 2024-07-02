import React from "react";
import "../styling/PositionsTile.css";
import { useNavigate } from "react-router-dom";

const PositionsTile = ({ data }) => {
    const navigator = useNavigate();
    
    return (
        <div className="positions-tile" onClick={() => navigator("/stocks/" + data.symbol, {replace: true})}>
            <div className="positions-tile-symbol">{data.symbol}</div>
            <div className="positions-tile-divider"/>
            <div className="positions-tile-shares">{data.quantity} Shares</div>
            <div className="positions-tile-data">{data.price}</div>
        </div>
    )
}

export default PositionsTile;