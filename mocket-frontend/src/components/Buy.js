import React, { useState, useContext } from "react";
import { buyInputValid, parsePrice } from "./Utils";
import Alert from "./Alert";
import { UserContext } from "./UserContext";
import axios from "axios";
import "../styling/Buy.css"

const Buy = ({ symbol, balance, live }) => {
    const restEndpoint = 'http://localhost:8080/database/user/addPos';
    const { user, token, refetch } = useContext(UserContext);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState(null);
    const handleChange = (e) => {
        const val = e.target.value;
        if(buyInputValid(val, balance, live)) {
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
            position: {
                symbol: symbol,
                quantity: document.getElementById("buy-in").value,
                buy: live
            }
        }
        const config = { 
            headers: { Authorization: `Bearer ${token}` }
        }
        return axios.put(restEndpoint, body, config)
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
                    <Alert message={error} style={"error"} setAlert={setError}/>
                ) : (
                    <div/>
                )}
            </div>
            <div className="buy">
                <div className="buy-header">
                    <div className="buy-header-left">{symbol}</div>
                    <div className="buy-header-right">${parsePrice(balance)} Available</div>
                </div>
                <div className="buy-divider"/>
                <div className="buy-input-box">
                    <div className="buy-input-label">Number of Shares</div>
                    <input 
                        id="buy-in" 
                        type="number" 
                        className="buy-input" 
                        placeholder="0" 
                        onChange={handleChange}
                    />
                </div>
                <div className="buy-divider"/>
                <div className="buy-shares">
                    <div className="buy-shares-label">Share Value</div>
                    <div className="buy-shares-live">${live}</div>
                </div>
                <div className="buy-divider"/>
                <div className="buy-total">
                    <div className="buy-total-label">Total Value</div>
                    <div className="buy-total-live">${parsePrice(total)}</div>
                </div>
                <div className="buy-divider"/>
                <button 
                    id="buy" 
                    className="buy-button" 
                    disabled={btnDisabled} 
                    onClick={handleClick}>
                    Trade
                </button>
            </div>
        </div>
    )
}

export default Buy;