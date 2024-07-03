import React from "react";
import "../styling/Buy.css"

const Buy = ({ symbol, balance, live }) => {
    const handleChange = (e) => {
        e.preventDefault();
    }

    return (
        <div className="buy">
            <div className="buy-header">
                <div className="buy-header-left">AAPL</div>
                <div className="buy-header-right">$10000 Available</div>
            </div>
            <div className="buy-divider"/>
            <div className="buy-input-box">
                <div className="buy-input-label">Number of Shares</div>
                <input className="buy-input" placeholder="0" onChange={handleChange}/>
            </div>
            <div className="buy-divider"/>
            <div className="buy-shares">
                <div className="buy-shares-label">Share Value</div>
                <div className="buy-shares-live">$200</div>
            </div>
            <div className="buy-divider"/>
            <div className="buy-total">
                <div className="buy-total-label">Total Value</div>
                <div className="buy-total-live">$400</div>
            </div>
            <div className="buy-divider"/>
            <button className="buy-button">Trade</button>
            
        </div>
    )
}

export default Buy;