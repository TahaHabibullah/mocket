import React from "react";
import "../styling/Sell.css";

const Sell = ({ symbol, positions, live }) => {
    const handleChange = (e) => {
        e.preventDefault();
    }

    return (
        <div className="sell">
            <div className="sell-header">
                <div className="sell-header-left">NVDA</div>
                <div className="sell-header-right">33 Shares Available</div>
            </div>
            <div className="sell-divider"/>
            <div className="sell-input-box">
                <div className="sell-input-label">Number of Shares</div>
                <input className="sell-input" placeholder="0" onChange={handleChange}/>
            </div>
            <div className="sell-divider"/>
            <div className="sell-shares">
                <div className="sell-shares-label">Share Value</div>
                <div className="sell-shares-live">$200</div>
            </div>
            <div className="sell-divider"/>
            <div className="sell-total">
                <div className="sell-total-label">Total Value</div>
                <div className="sell-total-live">$400</div>
            </div>
            <div className="sell-divider"/>
            <button className="sell-button">Trade</button>
        </div>
    )
}

export default Sell;