import React, { useState, useContext } from "react";
import { sellInputValid, getTotalShares, parsePrice } from "./Utils";
import "../styling/Sell.css";
import { UserContext } from "./UserContext";

const Sell = ({ symbol, positions, live }) => {
    const restEndpoint = "http://19.26.28.37:8080/database/user/closePos";
    const { refetch } = useContext(UserContext);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [total, setTotal] = useState(0);
    const handleChange = (e) => {
        const val = e.target.value;
        if(sellInputValid(val, getTotalShares(positions))) {
            setBtnDisabled(false);
            setTotal(live * val);
        }
        else {
            setBtnDisabled(true);
        }
    }

    const handleClick = async () => {
        const body = {
            "userId": "669c943e6e45b63f43d7add8",
            "symbol": symbol,
            "quantity": document.getElementById("sell-in").value,
            "price": live
        }
        return fetch(restEndpoint, {
            method: 'PUT',
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        .then((response) => response.json())
        .then((responseJson) => {
            refetch();
            console.log(responseJson);
        })
    }

    return (
        <div className="sell">
            <div className="sell-header">
                <div className="sell-header-left">{symbol}</div>
                <div className="sell-header-right">{getTotalShares(positions)} Shares Available</div>
            </div>
            <div className="sell-divider"/>
            <div className="sell-input-box">
                <div className="sell-input-label">Number of Shares</div>
                <input 
                    id="sell-in"
                    type="number" 
                    className="sell-input" 
                    placeholder="0" 
                    onChange={handleChange}
                />
            </div>
            <div className="sell-divider"/>
            <div className="sell-shares">
                <div className="sell-shares-label">Share Value</div>
                <div className="sell-shares-live">${live}</div>
            </div>
            <div className="sell-divider"/>
            <div className="sell-total">
                <div className="sell-total-label">Total Value</div>
                <div className="sell-total-live">${parsePrice(total)}</div>
            </div>
            <div className="sell-divider"/>
            <button 
                id="sell" 
                className="sell-button" 
                disabled={btnDisabled} 
                onClick={handleClick}>
                Trade
            </button>
        </div>
    )
}

export default Sell;