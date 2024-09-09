import React, { useState, useContext } from "react";
import { sellInputValid, getTotalShares, parsePrice } from "./Utils";
import Alert from "./Alert";
import { UserContext } from "./UserContext";
import axios from "axios";
import "../styling/Sell.css";

const Sell = ({ symbol, positions, live }) => {
    const restEndpoint = '/database/user/closePos';
    const { user, refetch } = useContext(UserContext);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState(null);
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
            userId: user.id,
            symbol: symbol,
            quantity: document.getElementById("sell-in").value,
            price: live
        }
        return axios.put(restEndpoint, body)
        .then((response) => {
            refetch();
        }).catch(error => {
            setError("Failed to send data to backend.");
            console.log(error);
        })
    }

    return (
        <div>
            <div>
                {error ? (
                    <Alert message={error} style={"error"} setError={setError}/>
                ) : (
                    <div/>
                )}
            </div>
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
        </div>
    )
}

export default Sell;