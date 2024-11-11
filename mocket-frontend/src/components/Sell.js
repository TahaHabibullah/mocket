import React, { useState, useContext } from "react";
import { sellInputValid, getTotalShares, parsePrice } from "./Utils";
import Alert from "./Alert";
import { UserContext } from "./UserContext";
import axios from "axios";
import "../styling/TradePanel.css";

const Sell = ({ symbol, positions, live }) => {
    const restEndpoint = 'http://localhost:8080/database/user/closePos';
    const { user, refetch } = useContext(UserContext);
    const [btnDisabled, setBtnDisabled] = useState(true);
    const [total, setTotal] = useState(0);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [buttonClass, setButtonClass] = useState("");
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
        setIsLoading(true);
        const body = {
            userId: user.id,
            symbol: symbol,
            quantity: document.getElementById("sell-in").value,
            price: live
        }
        return axios.put(restEndpoint, body)
        .then((response) => {
            refetch();
            setButtonClass("success");
            setTimeout(() => setButtonClass(""), 200);
        }).catch(error => {
            setError("Failed to send data to backend.");
            console.log(error);
            setButtonClass("error");
            setTimeout(() => setButtonClass(""), 200);
        }).finally(() => {
            setIsLoading(false);
        });
    };

    return (
        <div>
            <div>
                {error ? (
                    <Alert message={error} style={"error"} setAlert={setError}/>
                ) : (
                    <div/>
                )}
            </div>
            <div className="trade-panel">
                <div className="trade-panel-header">
                    <div className="trade-panel-header-left">{symbol}</div>
                    <div className="trade-panel-header-right">{getTotalShares(positions)} Shares Available</div>
                </div>
                <div className="trade-panel-divider"/>
                <div className="trade-panel-input-box">
                    <div className="trade-panel-input-label">Number of Shares</div>
                    <input 
                        id="sell-in"
                        type="number" 
                        className="trade-panel-input" 
                        placeholder="0" 
                        onChange={handleChange}
                    />
                </div>
                <div className="trade-panel-divider"/>
                <div className="trade-panel-shares">
                    <div className="trade-panel-shares-label">Share Value</div>
                    <div className="trade-panel-shares-live">${live}</div>
                </div>
                <div className="trade-panel-divider"/>
                <div className="trade-panel-total">
                    <div className="trade-panel-total-label">Total Value</div>
                    <div className="trade-panel-total-live">${parsePrice(total)}</div>
                </div>
                <div className="trade-panel-divider"/>
                <button 
                    id="sell" 
                    className={`trade-panel-button ${buttonClass}`}
                    disabled={btnDisabled || isLoading} 
                    onClick={handleClick}>
                        {isLoading ? (
                            <div className="trade-panel-loading-spinner"/>
                        ) : (
                            'Trade'
                        )}
                </button>
            </div>
        </div>
    );
};

export default Sell;